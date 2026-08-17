"use client";

import NextLink from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { stripLocale, withLocale } from "@/i18n/path";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("chrome");
  const pathname = stripLocale(usePathname() || "/");
  const query = useSearchParams().toString();
  const suffix = query ? `?${query}` : "";
  const enHref = `${pathname}${suffix}`;
  const deHref = withLocale(`${pathname}${suffix}`, "de");

  return (
    <nav aria-label={t("language")} className="flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
      <NextLink
        href={enHref}
        hrefLang="en"
        className={locale === "en" ? "text-sife-lime" : "text-sife-white/60 hover:text-sife-lime"}
        aria-current={locale === "en" ? "true" : undefined}
      >
        {t("en")}
      </NextLink>
      <span className="text-sife-white/30" aria-hidden>
        /
      </span>
      <NextLink
        href={deHref}
        hrefLang="de"
        className={locale === "de" ? "text-sife-lime" : "text-sife-white/60 hover:text-sife-lime"}
        aria-current={locale === "de" ? "true" : undefined}
      >
        {t("de")}
      </NextLink>
    </nav>
  );
}
