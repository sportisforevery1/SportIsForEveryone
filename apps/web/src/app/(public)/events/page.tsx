import type { Metadata } from "next";

import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { EventCards } from "@/components/events/EventCards";
import { getEventsIndex } from "@/lib/events";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events | Sport is for Everyone",
  description: "Come for the talks, Stay for the adventure.",
};

export default async function EventsPage() {
  const events = await getEventsIndex();

  return (
    <>
      <PageHero label="Events" heading={events.heading} />
      {events.upcoming.length > 0 ? (
        <EventCards events={events.upcoming} label="Upcoming" title="" />
      ) : (
        <EmptyState label="Upcoming" title={events.subheading} />
      )}
      <EventCards events={events.past} label="Events" title="Previous events" />
    </>
  );
}
