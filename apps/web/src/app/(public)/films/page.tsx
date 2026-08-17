import type { Metadata } from "next";

import { EditorialList } from "@/components/editorial/EditorialList";
import { PageHero } from "@/components/editorial/PageHero";
import { FeaturedPlayer } from "@/components/watch/FeaturedPlayer";
import { getFilmsIndex } from "@/lib/watch";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Films & Visual Stories | Sport is for Everyone",
  description: "An ongoing archive of films that move literally and metaphorically",
};

export default async function FilmsPage() {
  const films = await getFilmsIndex();

  return (
    <>
      <PageHero label="Watch" heading={films.heading} subheading={films.subheading} />
      {films.featured ? <FeaturedPlayer film={films.featured} /> : null}
      <EditorialList items={films.more} label="Watch" title="More films" cta="Watch" />
    </>
  );
}
