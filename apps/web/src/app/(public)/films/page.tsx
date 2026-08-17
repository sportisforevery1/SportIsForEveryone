import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EditorialList } from "@/components/editorial/EditorialList";
import { PageHero } from "@/components/editorial/PageHero";
import { FeaturedPlayer } from "@/components/watch/FeaturedPlayer";
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
  const [films, tChrome, tWatch, tHome] = await Promise.all([
    getFilmsIndex(),
    getTranslations("chrome"),
    getTranslations("watch"),
    getTranslations("home"),
  ]);

  return (
    <>
      <PageHero label={tChrome("watch")} heading={films.heading} subheading={films.subheading} />
      {films.featured ? <FeaturedPlayer film={films.featured} /> : null}
      <EditorialList items={films.more} label={tChrome("watch")} title={tWatch("moreFilms")} cta={tHome("watch")} />
    </>
  );
}
