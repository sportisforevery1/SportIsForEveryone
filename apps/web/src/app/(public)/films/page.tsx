import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/editorial/PageHero";
import { FeaturedPlayer } from "@/components/watch/FeaturedPlayer";
import { FilmGrid } from "@/components/watch/FilmGrid";
import { cmsPageMetadata } from "@/lib/seo";
import { getFilmsIndex } from "@/lib/watch";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("films", {
    title: "Films & Visual Stories",
    description: "An ongoing archive of films that move literally and metaphorically",
  });
}

export default async function FilmsPage() {
  const [films, tChrome, tWatch] = await Promise.all([
    getFilmsIndex(),
    getTranslations("chrome"),
    getTranslations("watch"),
  ]);

  return (
    <>
      <PageHero label={tChrome("watch")} heading={films.heading} subheading={films.subheading} />
      {films.featured ? <FeaturedPlayer film={films.featured} /> : null}
      <FilmGrid films={films.more} label={tChrome("watch")} title={tWatch("moreFilms")} />
    </>
  );
}
