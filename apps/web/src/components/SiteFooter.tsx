import Image from "next/image";
import Link from "next/link";

import { contact, footerLinks, manifesto, socials } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-sife-black text-sife-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <Image
            src="/brand/EmblemLime.png"
            alt="Sport is for Everyone"
            width={88}
            height={84}
            className="mb-5 h-16 w-auto"
          />
          <p className="max-w-xs text-sm leading-relaxed text-sife-lime">
            {manifesto}
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-sife-white/50">
            Explore
          </p>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link text-sm">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-sife-white/50">
            Location
          </p>
          {contact.locationLines.map((line) => (
            <p key={line} className="text-sm text-sife-white/80">
              {line}
            </p>
          ))}
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-sife-white/50">
            Contact
          </p>
          <p className="text-sm">
            For partnerships or media inquiries:{" "}
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
              Impressum
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-sife-lime/15 px-5 py-5 text-center text-xs uppercase tracking-[0.16em] text-sife-white/40">
        © All Rights Reserved, 2026 SPORT IS FOR EVERYONE
      </div>
    </footer>
  );
}
