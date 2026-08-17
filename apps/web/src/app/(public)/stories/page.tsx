import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EditorialList } from "@/components/editorial/EditorialList";
import { PageHero } from "@/components/editorial/PageHero";
import { SeriesCards } from "@/components/editorial/SeriesCards";
import { getStoriesIndex } from "@/lib/read";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("stories", {
    title: "Stories across borders",
    description: "Sport, across lives and places.",
  });
}

export default async function StoriesPage() {
  const [stories, tChrome] = await Promise.all([getStoriesIndex(), getTranslations("chrome")]);

  return (
    <>
      <PageHero label={tChrome("read")} heading={stories.heading} subheading={stories.subheading} />
      <SeriesCards items={stories.series} />
      <EditorialList items={stories.more} label={tChrome("read")} title="More stories" />
    </>
  );
}
