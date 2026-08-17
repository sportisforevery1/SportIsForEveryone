"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { nav } from "@/lib/site";

function Dropdown({
  label,
  items,
}: {
  label: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="nav-link inline-flex items-center gap-1"
        aria-haspopup="true"
      >
        {label}
        <span aria-hidden className="text-[0.65rem]">
          ▾
        </span>
      </button>
      <div className="invisible absolute left-0 top-full z-40 min-w-56 translate-y-1 bg-sife-black pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="border border-sife-lime/20 bg-sife-black p-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-2 py-2 text-sm uppercase tracking-[0.12em] text-sife-white/80 transition hover:text-sife-lime"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sife-lime/15 bg-sife-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/brand/EmblemLime.png"
            alt="Sport is for Everyone"
            width={48}
            height={46}
            priority
            className="h-10 w-auto md:h-12"
          />
          <span className="hidden max-w-28 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.14em] text-sife-lime sm:block">
            Sport is for Everyone
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          <Dropdown label={nav.watch.label} items={nav.watch.items} />
          <Dropdown label={nav.read.label} items={nav.read.items} />
          <Link href={nav.events.href} className="nav-link">
            {nav.events.label}
          </Link>
          <Dropdown label={nav.about.label} items={nav.about.items} />
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <span className="text-xs uppercase tracking-[0.16em] text-sife-white/60">
            English
          </span>
          <Link href={nav.database.href} className="btn-coral">
            {nav.database.label}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-sife-lime lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close Menu" : "Open Menu"}</span>
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
          className="border-t border-sife-lime/15 bg-sife-black px-5 py-6 lg:hidden"
        >
          <div className="flex flex-col gap-5 text-sm uppercase tracking-[0.14em] text-sife-white">
            <p className="text-sife-lime">Watch</p>
            {nav.watch.items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <p className="text-sife-lime">Read</p>
            {nav.read.items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href={nav.events.href} onClick={() => setOpen(false)}>
              {nav.events.label}
            </Link>
            <p className="text-sife-lime">About</p>
            {nav.about.items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href={nav.database.href} className="btn-coral w-fit" onClick={() => setOpen(false)}>
              {nav.database.label}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
