import type { Metadata } from "next";

import { EditorialList } from "@/components/editorial/EditorialList";
import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { getWhereSheStandsIndex } from "@/lib/read";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Where She Stands | Sport is for Everyone",
  description: "Stories by Women, for Women",
};

export default async function WhereSheStandsPage() {
  const page = await getWhereSheStandsIndex();

  return (
    <>
      <PageHero label="Read" heading={page.heading} />
      {page.items.length > 0 ? (
        <EditorialList items={page.items} label="Where She Stands" title="" />
      ) : (
        <EmptyState label="Where She Stands" title={page.subheading} />
      )}
    </>
  );
}
