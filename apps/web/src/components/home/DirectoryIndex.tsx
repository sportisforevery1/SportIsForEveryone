import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { directory, numbered } from "@/lib/site";

export async function DirectoryIndex() {
  const t = await getTranslations("home");

  return (
    <section className="sife-section px-5 md:px-12">
      <Reveal>
        <CategoryLabel>{t("findWayLabel")}</CategoryLabel>
        <h2 className="sife-display mt-3">{t("findWayTitle")}</h2>
        <ul className="mt-10 border-t border-sife-white/20">
          {directory.map((entry, index) => (
            <li
              key={entry.href}
              className="group relative grid items-center gap-x-8 gap-y-4 border-b border-sife-white/20 py-6 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[4.5rem_minmax(0,26.25rem)_minmax(0,1fr)_13.75rem]"
            >
              <span className="text-[0.8rem] font-semibold tracking-[0.12em] text-sife-lime">
                {numbered(index)}
              </span>
              <div>
                <h3 className="text-2xl font-semibold uppercase leading-none tracking-[-0.03em] md:text-[1.75rem]">
                  <Link
                    href={entry.href}
                    className="after:absolute after:inset-0 transition group-hover:text-sife-lime"
                  >
                    {entry.title}
                  </Link>
                </h3>
                <p className="mt-2 max-w-[23.75rem] text-sm leading-normal text-sife-white/75">{entry.blurb}</p>
              </div>
              <div className="relative z-10 flex flex-wrap gap-2 md:col-start-3 lg:col-start-auto">
                {entry.links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="inline-flex items-center border border-sife-lime/50 px-3 py-[0.45rem] text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-sife-lime transition hover:bg-sife-lime hover:text-sife-true-black"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="hidden overflow-hidden lg:block">
                <Image
                  src={entry.image.src}
                  alt={entry.image.alt}
                  width={entry.image.width}
                  height={entry.image.height}
                  sizes="220px"
                  className="h-[8.25rem] w-[13.75rem] object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
