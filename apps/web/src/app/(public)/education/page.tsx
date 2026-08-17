import type { Metadata } from "next";

import { EditorialList } from "@/components/editorial/EditorialList";
import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { getEducationIndex } from "@/lib/read";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Education | Sport is for Everyone",
  description: "We're building something worth reading. Coming soon.",
};

export default async function EducationPage() {
  const page = await getEducationIndex();

  return (
    <>
      <PageHero label="Read" heading={page.heading} />
      {page.items.length > 0 ? (
        <EditorialList items={page.items} label="Education" title="" />
      ) : (
        <EmptyState label="Education" title={page.subheading} />
      )}
    </>
  );
}
