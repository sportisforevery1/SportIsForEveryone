import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
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

  if (locale === "de") {
    const url = request.nextUrl.clone();
    url.pathname = stripLocale(pathname);
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const response = NextResponse.next({ request: { headers } });
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (!isLocale(cookie) || cookie === defaultLocale) {
    response.cookies.set("NEXT_LOCALE", defaultLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
