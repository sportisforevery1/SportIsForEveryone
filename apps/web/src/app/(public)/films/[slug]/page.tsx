import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EnglishOriginalNote } from "@/components/editorial/EnglishOriginalNote";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { EditorialList } from "@/components/editorial/EditorialList";
import { RichText } from "@/components/editorial/RichText";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import { VideoEmbed } from "@/components/watch/VideoEmbed";
import { getFilmBySlug, getRelatedFilms } from "@/lib/watch";

export const dynamic = "force-dynamic";

type FilmPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const { slug } = await params;
  const film = await getFilmBySlug(slug);

  if (!film) return { title: "Film | Sport is for Everyone" };

  return {
    title: `${film.seoTitle || film.title} | Sport is for Everyone`,
    description: film.seoDescription || undefined,
  };
}

export default async function FilmPage({ params }: FilmPageProps) {
  const { slug } = await params;
  const film = await getFilmBySlug(slug);

  if (!film) notFound();

  const related = await getRelatedFilms(film.slug);
  const meta = [film.location, film.year, film.runtime].filter(Boolean).join(" · ");

  return (
    <>
      <article className="px-5 pb-20 pt-16 md:px-12 md:pb-28 md:pt-24">
        <Reveal>
          <EnglishOriginalNote />
          <p className="mb-8">
            <HoverUnderline href="/films" className="text-sife-lime">
              Films
            </HoverUnderline>
          </p>
          <CategoryLabel>Film</CategoryLabel>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold uppercase leading-[0.92] tracking-tight md:text-6xl">
            {film.title}
          </h1>
          {meta ? (
            <p className="mt-4 text-sm uppercase tracking-[0.16em] text-sife-white/60">{meta}</p>
          ) : null}
          <div className="mt-10">
            <VideoEmbed url={film.videoUrl} title={film.title} eager />
          </div>
          {film.body ? (
            <div className="mt-12 max-w-3xl text-sife-white/80">
              <RichText data={film.body} />
            </div>
          ) : film.excerpt ? (
            <p className="mt-12 max-w-3xl text-base leading-relaxed text-sife-white/80 md:text-lg">
              {film.excerpt}
            </p>
          ) : null}
          {film.credits ? (
            <div className="mt-14 max-w-3xl border-t border-sife-lime/20 pt-10">
              <CategoryLabel>Credits</CategoryLabel>
              <div className="mt-4 text-sm text-sife-white/70">
                <RichText data={film.credits} />
              </div>
            </div>
          ) : null}
        </Reveal>
      </article>
      <EditorialList items={related} label="Watch" title="More films" cta="Watch" />
    </>
  );
}
