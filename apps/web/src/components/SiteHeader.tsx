"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { navMessageKey } from "@/i18n/nav";
import { stripLocale } from "@/i18n/path";
import { nav } from "@/lib/site";

type NavItem = { href: string; label: string };

function isActive(pathname: string, hrefs: readonly string[]): boolean {
  return hrefs.some((href) => pathname === href || pathname.startsWith(`${href}/`));
}

function Dropdown({
  label,
  items,
  active,
}: {
  label: string;
  items: readonly NavItem[];
  active: boolean;
}) {
  const t = useTranslations("nav");

  return (
    <div className="group relative">
      <button
        type="button"
        className={`nav-link inline-flex items-center gap-1 ${active ? "is-active" : ""}`.trim()}
        aria-haspopup="true"
      >
        {label}
        <span aria-hidden className="text-[0.6rem] opacity-80">
          ▾
        </span>
      </button>
      <div className="invisible absolute left-0 top-full z-40 min-w-56 translate-y-1 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="border border-sife-lime/20 bg-sife-bg-deep p-3 shadow-xl">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-2 py-2 text-sm uppercase tracking-[0.12em] text-sife-white/80 transition hover:text-sife-lime"
              >
                {t(navMessageKey(item.href))}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NewBadge({ label }: { label: string }) {
  return (
    <span className="bg-sife-lime px-[0.3rem] py-[0.1rem] text-[0.56rem] font-bold tracking-[0.1em] text-sife-black">
      {label}
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = stripLocale(usePathname() || "/");
  const t = useTranslations("chrome");
  const tNav = useTranslations("nav");

  const activeClass = (hrefs: readonly string[]) => (isActive(pathname, hrefs) ? "is-active" : "");
  const hrefs = (items: readonly NavItem[]) => items.map((item) => item.href);

  return (
    <header className="sticky top-0 z-50 border-b border-sife-lime/15 bg-sife-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/brand/EmblemLime.png"
            alt="Sport is for Everyone"
            width={48}
            height={46}
            priority
            className="h-10 w-auto md:h-11"
          />
          <span className="hidden max-w-28 text-[0.625rem] font-semibold uppercase leading-tight tracking-[0.14em] text-sife-lime sm:block">
            Sport is for Everyone
          </span>
        </Link>

        <nav className="hidden items-center gap-[1.875rem] lg:flex" aria-label="Primary">
          <Dropdown label={t("watch")} items={nav.watch.items} active={isActive(pathname, hrefs(nav.watch.items))} />
          <Dropdown label={t("read")} items={nav.read.items} active={isActive(pathname, hrefs(nav.read.items))} />
          <Link href={nav.academy.href} className={`nav-link inline-flex items-center gap-2 ${activeClass([nav.academy.href])}`.trim()}>
            {t("academy")}
            <NewBadge label={t("new")} />
          </Link>
          <Link href={nav.events.href} className={`nav-link ${activeClass([nav.events.href])}`.trim()}>
            {t("events")}
          </Link>
          <Dropdown label={t("about")} items={nav.about.items} active={isActive(pathname, hrefs(nav.about.items))} />
        </nav>

        <div className="hidden items-center gap-[1.125rem] lg:flex">
          <LanguageSwitcher />
          <Link href={nav.database.href} className="btn-coral">
            {tNav("database")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-sife-lime lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </span>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-sife-lime/15 bg-sife-bg px-5 py-6 lg:hidden"
        >
          <div className="flex flex-col gap-5 text-sm uppercase tracking-[0.14em] text-sife-white">
            <LanguageSwitcher />
            <p className="text-sife-lime">{t("watch")}</p>
            {nav.watch.items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {tNav(navMessageKey(item.href))}
              </Link>
            ))}
            <p className="text-sife-lime">{t("read")}</p>
            {nav.read.items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {tNav(navMessageKey(item.href))}
              </Link>
            ))}
            <Link href={nav.academy.href} className="inline-flex items-center gap-2" onClick={() => setOpen(false)}>
              {t("academy")}
              <NewBadge label={t("new")} />
            </Link>
            <Link href={nav.events.href} onClick={() => setOpen(false)}>
              {t("events")}
            </Link>
            <p className="text-sife-lime">{t("about")}</p>
            {nav.about.items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {tNav(navMessageKey(item.href))}
              </Link>
            ))}
            <Link href={nav.database.href} className="btn-coral w-fit" onClick={() => setOpen(false)}>
              {tNav("database")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
