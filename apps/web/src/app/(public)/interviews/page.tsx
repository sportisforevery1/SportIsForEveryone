import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EditorialList } from "@/components/editorial/EditorialList";
import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { cmsPageMetadata } from "@/lib/seo";
import { getInterviewsIndex } from "@/lib/watch";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("interviews", {
    title: "Field Interviews",
    description: "Unscripted conversations / anyone, anywhere, as long as sport is part of the story.",
  });
}

export default async function InterviewsPage() {
  const [interviews, tChrome, tNav, tHome] = await Promise.all([
    getInterviewsIndex(),
    getTranslations("chrome"),
    getTranslations("nav"),
    getTranslations("home"),
  ]);

  return (
    <>
      <PageHero label={tChrome("watch")} heading={interviews.heading} />
      {interviews.items.length > 0 ? (
        <EditorialList
          items={interviews.items}
          label={tNav("interviews")}
          title=""
          cta={tHome("readMore")}
        />
      ) : (
        <EmptyState
          label={tNav("interviews")}
          title="Unscripted conversations"
          body="anyone, anywhere, as long as sport is part of the story."
        />
      )}
    </>
  );
}
