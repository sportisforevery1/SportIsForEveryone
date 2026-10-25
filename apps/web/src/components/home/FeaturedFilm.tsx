import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import type { HomeFilm } from "@/lib/home";
import Image from "next/image";

/** Compact thumbnail + text row — PDF: less repetitive / not a second hero. */
export async function FeaturedFilm({ film }: { film: HomeFilm }) {
  const t = await getTranslations("home");

  return (
    <section className="border-y border-sife-white/10 bg-sife-black px-5 py-10 md:px-12 md:py-12">
      <Reveal>
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
          {film.image ? (
            <Image
              src={film.image.src}
              alt={film.image.alt}
              width={film.image.width}
              height={film.image.height}
              className="aspect-video w-full object-cover"
              sizes="(min-width: 768px) 18rem, 100vw"
            />
          ) : (
            <div className="aspect-video bg-sife-lime" />
          )}
          <div>
            <CategoryLabel>{t("featuredFilm")}</CategoryLabel>
            <h2 className="mt-2 max-w-xl text-xl font-semibold uppercase tracking-tight md:text-2xl">
              {film.title}
            </h2>
            {film.location || film.runtime ? (
              <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-sife-white/55">
                {[film.location, film.runtime].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            {film.excerpt ? (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-sife-white/70 line-clamp-2">
                {film.excerpt}
              </p>
            ) : null}
            <p className="mt-4">
              <HoverUnderline href={film.href} className="text-sife-lime">
                {t("watch")}
              </HoverUnderline>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
