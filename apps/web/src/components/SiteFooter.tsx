import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { navMessageKey } from "@/i18n/nav";
import { contact, footerLinks, manifesto, socials } from "@/lib/site";

export async function SiteFooter({ shopPublic = false }: { shopPublic?: boolean }) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const links = shopPublic ? footerLinks : footerLinks.filter((link) => link.href !== "/shop");

  return (
    <footer className="mt-auto bg-sife-navy text-sife-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr_1.2fr] md:px-12">
        <div className="md:col-span-1">
          <Image
            src="/brand/EmblemLime.png"
            alt="Sport is for Everyone"
            width={88}
            height={84}
            className="mb-[1.125rem] h-14 w-auto"
          />
          <p className="max-w-[16.25rem] text-sm leading-relaxed text-sife-lime">
            {manifesto}
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-sife-white/50">
            {t("explore")}
          </p>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link text-sm">
                  {tNav(navMessageKey(link.href))}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-sife-white/50">
            {t("location")}
          </p>
          {contact.locationLines.map((line) => (
            <p key={line} className="text-sm text-sife-white/80">
              {line}
            </p>
          ))}
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-sife-white/50">
            {t("contact")}
          </p>
          <p className="text-sm">
            {t("partnerships")}{" "}
            <a className="text-sife-lime underline-offset-4 hover:underline" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </p>
          <div className="mt-4 flex gap-4">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                className="text-xs uppercase tracking-[0.16em] text-sife-white/70 hover:text-sife-lime"
                target="_blank"
                rel="noreferrer"
              >
                {social.label}
              </a>
            ))}
          </div>
          <p className="mt-6">
            <Link href="/impressum" className="text-xs uppercase tracking-[0.16em] text-sife-white/50 hover:text-sife-lime">
              {t("impressum")}
            </Link>
            <span className="mx-2 text-sife-white/30">·</span>
            <Link href="/privacy" className="text-xs uppercase tracking-[0.16em] text-sife-white/50 hover:text-sife-lime">
              {t("privacy")}
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-sife-lime/15 px-5 py-5 text-center text-xs uppercase tracking-[0.16em] text-sife-white/40">
        {t("copyright")}
      </div>
    </footer>
  );
}
