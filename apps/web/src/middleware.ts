import { NextResponse, type NextRequest } from "next/server";

import { type Locale } from "@/i18n/config";
import { localeFromPath, stripLocale } from "@/i18n/path";

function skipped(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/seed") ||
    /\.[^/]+$/.test(pathname)
  );
}

/** Read role from Payload JWT without verifying (redirect hint only). */
function jwtRole(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = JSON.parse(atob(padded)) as { role?: string };
    return typeof json.role === "string" ? json.role : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Learners never use the CMS — send them to the public account area.
  if (pathname.startsWith("/admin")) {
    const role = jwtRole(request.cookies.get("payload-token")?.value);
    if (role === "learner") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    return NextResponse.next();
  }

  if (skipped(pathname)) return NextResponse.next();

  const locale: Locale = localeFromPath(pathname);
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);

  // Path decides locale (/ vs /de). Do not Set-Cookie here — that forces
  // cache MISS on every HTML response and makes staging feel slow.
  if (locale === "de") {
    const url = request.nextUrl.clone();
    url.pathname = stripLocale(pathname);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
