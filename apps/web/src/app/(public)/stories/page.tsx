import type { Metadata } from "next";

import { EditorialList } from "@/components/editorial/EditorialList";
import { PageHero } from "@/components/editorial/PageHero";
import { SeriesCards } from "@/components/editorial/SeriesCards";
import { getStoriesIndex } from "@/lib/read";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Stories across borders | Sport is for Everyone",
  description: "Sport, across lives and places.",
};

export default async function StoriesPage() {
  const stories = await getStoriesIndex();

  return (
    <>
      <PageHero label="Read" heading={stories.heading} subheading={stories.subheading} />
      <SeriesCards items={stories.series} />
      <EditorialList items={stories.more} label="Read" title="More stories" />
    </>
  );
}
