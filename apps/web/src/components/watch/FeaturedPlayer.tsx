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
    <section className="px-5 pb-20 md:px-12 md:pb-28">
      <Reveal>
        <CategoryLabel>{t("featuredFilm")}</CategoryLabel>
        <h2 className="mt-4 max-w-4xl text-3xl font-semibold uppercase leading-tight tracking-tight md:text-6xl">
          {film.title}
        </h2>
        {meta ? (
          <p className="mt-4 text-sm uppercase tracking-[0.16em] text-sife-white/60">{meta}</p>
        ) : null}
        <div className="mt-10">
          <VideoEmbed url={film.videoUrl} title={film.title} eager />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            {film.excerpt ? (
              <p className="max-w-2xl text-base leading-relaxed text-sife-white/75 md:text-lg">
                {film.excerpt}
              </p>
            ) : null}
            <p className="mt-8">
              <HoverUnderline href={film.href} className="text-sife-lime">
                {tWatch("fullCredits")}
              </HoverUnderline>
            </p>
          </div>
          {film.credits ? (
            <div className="text-sm text-sife-white/70">
              <CategoryLabel>{tWatch("credits")}</CategoryLabel>
              <div className="mt-4">
                <RichText data={film.credits} />
              </div>
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
