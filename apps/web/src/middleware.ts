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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
