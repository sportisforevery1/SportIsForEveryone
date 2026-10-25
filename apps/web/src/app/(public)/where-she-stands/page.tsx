import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EditorialList } from "@/components/editorial/EditorialList";
import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { getWhereSheStandsIndex } from "@/lib/read";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("where-she-stands", {
    title: "Where She Stands",
    description: "Stories by Women, for Women",
  });
}

export default async function WhereSheStandsPage() {
  const [page, tChrome, tNav, tHome] = await Promise.all([
    getWhereSheStandsIndex(),
    getTranslations("chrome"),
    getTranslations("nav"),
    getTranslations("home"),
  ]);

  return (
    <>
      <PageHero
        label={tChrome("read")}
        heading={page.heading}
        subheading={page.subheading}
        compact
      />
      {page.items.length > 0 ? (
        <EditorialList
          items={page.items}
          label={tNav("whereSheStands")}
          title="Essays & voices"
          cta={tHome("readMore")}
        />
      ) : (
        <EmptyState
          label={tNav("whereSheStands")}
          title={page.heading}
          body={page.subheading}
        />
      )}
    </>
  );
}
