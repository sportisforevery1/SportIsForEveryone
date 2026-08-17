import type { Metadata } from "next";

import { EditorialList } from "@/components/editorial/EditorialList";
import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { getInterviewsIndex } from "@/lib/watch";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Field Interviews | Sport is for Everyone",
  description: "Unscripted conversations / anyone, anywhere, as long as sport is part of the story.",
};

export default async function InterviewsPage() {
  const interviews = await getInterviewsIndex();

  return (
    <>
      <PageHero label="Watch" heading={interviews.heading} />
      {interviews.items.length > 0 ? (
        <EditorialList
          items={interviews.items}
          label="Field Interview"
          title=""
          cta="Read more"
        />
      ) : (
        <EmptyState
          label="Field Interview"
          title="Unscripted conversations"
          body="anyone, anywhere, as long as sport is part of the story."
        />
      )}
    </>
  );
}
