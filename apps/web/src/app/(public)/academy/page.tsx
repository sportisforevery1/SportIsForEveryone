import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EditorialList } from "@/components/editorial/EditorialList";
import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { getEducationIndex } from "@/lib/read";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("education", {
    title: "Academy",
    description: "We're building something worth reading. Coming soon.",
  });
}

export default async function AcademyPage() {
  const [page, tChrome, tNav] = await Promise.all([
    getEducationIndex(),
    getTranslations("chrome"),
    getTranslations("nav"),
  ]);

  return (
    <>
      <PageHero label={tChrome("academy")} heading={page.heading} />
      {page.items.length > 0 ? (
        <EditorialList items={page.items} label={tNav("education")} title="" />
      ) : (
        <EmptyState label={tNav("education")} title={page.subheading} />
      )}
    </>
  );
}
