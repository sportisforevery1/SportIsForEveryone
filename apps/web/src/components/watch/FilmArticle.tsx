import { EnglishOriginalNote } from "@/components/editorial/EnglishOriginalNote";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { RichText } from "@/components/editorial/RichText";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import { VideoEmbed } from "@/components/watch/VideoEmbed";
import type { WatchFilm } from "@/lib/watch";

export function FilmArticle({ film }: { film: WatchFilm }) {
  const meta = [film.location, film.year, film.runtime].filter(Boolean).join(" · ");

  return (
    <article className="bg-sife-navy text-sife-white">
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-5 sm:pt-14 md:px-12 md:pt-16">
        <Reveal eager>
          <EnglishOriginalNote />
          <p className="mb-6 sm:mb-8">
            <HoverUnderline href="/films" className="text-sife-lime">
              Films
            </HoverUnderline>
          </p>
          <CategoryLabel>Film</CategoryLabel>
          <h1 className="mt-3 max-w-4xl break-words text-[clamp(1.75rem,5.5vw,3.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em] sm:mt-4">
            {film.title}
          </h1>
          {meta ? (
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-sife-white/60 sm:mt-4 sm:text-sm">
              {meta}
            </p>
          ) : null}
        </Reveal>
      </div>

      {film.videoUrl ? (
        <div className="mx-auto mt-8 max-w-6xl px-0 sm:mt-10 sm:px-5 md:px-12">
          <Reveal eager>
            <VideoEmbed url={film.videoUrl} title={film.title} eager />
          </Reveal>
        </div>
      ) : null}

      <div className="bg-sife-cream text-sife-ink">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-5 sm:py-16 md:px-12 md:py-20">
          <Reveal>
            {film.excerpt ? (
              <p className="max-w-2xl text-lg leading-relaxed text-sife-ink/80 sm:text-xl">
                {film.excerpt}
              </p>
            ) : null}
            {film.body ? (
              <div className="sife-prose mx-auto mt-10 max-w-3xl text-sife-ink sm:mt-12">
                <RichText data={film.body} />
              </div>
            ) : null}
            {film.credits ? (
              <div className="mt-12 max-w-3xl border-t border-sife-ink/15 pt-8 sm:mt-14 sm:pt-10">
                <CategoryLabel tone="navy">Credits</CategoryLabel>
                <div className="mt-4 text-sm text-sife-ink/70">
                  <RichText data={film.credits} />
                </div>
              </div>
            ) : null}
          </Reveal>
        </div>
      </div>
    </article>
  );
}
