"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { stripLocale, withLocale } from "@/i18n/path";

/**
 * Locale is path-based (/ vs /de). Soft client navigations across the middleware
 * rewrite can leave React thinking the path is still "/" — so EN/DE need a real
 * document navigation, not next/link soft routing.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("chrome");
  const nextPath = usePathname() || "/";
  const [browserPath, setBrowserPath] = useState(nextPath);
  const query = useSearchParams().toString();
  const suffix = query ? `?${query}` : "";

  useEffect(() => {
    setBrowserPath(window.location.pathname || "/");
  }, [nextPath, locale]);

  const pathname = stripLocale(browserPath);
  const enHref = useMemo(() => `${pathname}${suffix}`, [pathname, suffix]);
  const deHref = useMemo(() => withLocale(`${pathname}${suffix}`, "de"), [pathname, suffix]);

  return (
    <nav aria-label={t("language")} className="flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
      <a
        href={enHref}
        hrefLang="en"
        className={locale === "en" ? "text-sife-lime" : "text-sife-white/60 hover:text-sife-lime"}
        aria-current={locale === "en" ? "page" : undefined}
      >
        {t("en")}
      </a>
      <span className="text-sife-white/30" aria-hidden>
        /
      </span>
      <a
        href={deHref}
        hrefLang="de"
        className={locale === "de" ? "text-sife-lime" : "text-sife-white/60 hover:text-sife-lime"}
        aria-current={locale === "de" ? "page" : undefined}
      >
        {t("de")}
      </a>
    </nav>
  );
}
