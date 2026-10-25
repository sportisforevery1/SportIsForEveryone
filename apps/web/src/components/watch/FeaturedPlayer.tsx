import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { RichText } from "@/components/editorial/RichText";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import { VideoEmbed } from "@/components/watch/VideoEmbed";
import type { WatchFilm } from "@/lib/watch";

export async function FeaturedPlayer({ film }: { film: WatchFilm }) {
  const t = await getTranslations("home");
  const tWatch = await getTranslations("watch");
  const meta = [film.location, film.year, film.runtime].filter(Boolean).join(" · ");

  return (
    <section className="sife-section px-5 md:px-12">
      <Reveal>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-8">
          <VideoEmbed url={film.videoUrl} title={film.title} eager />
          <div>
            <CategoryLabel>{t("featuredFilm")}</CategoryLabel>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold uppercase tracking-tight md:text-[2rem]">
              {film.title}
            </h2>
            {meta ? (
              <p className="mt-3 text-sm uppercase tracking-[0.16em] text-sife-white/60">{meta}</p>
            ) : null}
            {film.excerpt ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-sife-white/75">{film.excerpt}</p>
            ) : null}
            <p className="mt-6">
              <HoverUnderline href={film.href} className="text-sife-lime">
                {tWatch("fullCredits")}
              </HoverUnderline>
            </p>
            {film.credits ? (
              <div className="mt-10 text-sm text-sife-white/70">
                <CategoryLabel>{tWatch("credits")}</CategoryLabel>
                <div className="mt-4">
                  <RichText data={film.credits} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
