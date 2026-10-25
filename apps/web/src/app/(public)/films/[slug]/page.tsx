import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditorialList } from "@/components/editorial/EditorialList";
import { FilmArticle } from "@/components/watch/FilmArticle";
import { getFilmBySlug, getFilmSlugs, getRelatedFilms } from "@/lib/watch";

export const revalidate = 60;

type FilmPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getFilmSlugs();
  return slugs.map((slug) => ({ slug }));
}

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

  return (
    <>
      <FilmArticle film={film} />
      <EditorialList items={related} label="Watch" title="More films" cta="Watch" tone="dark" />
    </>
  );
}
