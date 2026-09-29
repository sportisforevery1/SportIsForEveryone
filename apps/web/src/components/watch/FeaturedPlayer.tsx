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
    <section className="px-5 pb-20 pt-6 md:px-12">
      <Reveal>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,5fr)] lg:gap-12">
          <VideoEmbed url={film.videoUrl} title={film.title} eager />
          <div>
            <CategoryLabel>{t("featuredFilm")}</CategoryLabel>
            <h2 className="mt-3 text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] md:text-[2rem]">
              {film.title}
            </h2>
            {meta ? (
              <p className="mt-2.5 text-xs uppercase tracking-[0.16em] text-sife-white/65">{meta}</p>
            ) : null}
            {film.excerpt ? (
              <p className="mt-[1.125rem] text-[0.95rem] leading-relaxed text-sife-white/85">{film.excerpt}</p>
            ) : null}
            {film.credits ? (
              <div className="mt-6 border-t border-sife-white/20 pt-4 text-[0.8125rem] leading-[1.7] text-sife-white/70">
                <CategoryLabel>{tWatch("credits")}</CategoryLabel>
                <div className="mt-2 [&_.sife-prose]:text-[0.8125rem] [&_.sife-prose]:leading-[1.7]">
                  <RichText data={film.credits} />
                </div>
              </div>
            ) : null}
            <p className="mt-5">
              <HoverUnderline href={film.href} className="text-xs text-sife-lime">
                {`${tWatch("fullCredits")} →`}
              </HoverUnderline>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
