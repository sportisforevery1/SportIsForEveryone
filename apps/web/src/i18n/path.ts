import { defaultLocale, type Locale } from "@/i18n/config";

export function stripLocale(pathname: string): string {
  if (pathname === "/de") return "/";
  if (pathname.startsWith("/de/")) {
    const next = pathname.slice(3);
    return next.startsWith("/") ? next : `/${next}`;
  }
  return pathname;
}

export function withLocale(href: string, locale: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const [rawPath, query] = href.split("?");
  const path = stripLocale(rawPath);
  const prefixed = locale === "de" ? (path === "/" ? "/de" : `/de${path}`) : path;
  return query ? `${prefixed}?${query}` : prefixed;
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/de" || pathname.startsWith("/de/") ? "de" : defaultLocale;
}
