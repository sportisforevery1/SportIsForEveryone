import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { EventCards } from "@/components/events/EventCards";
import { getEventsIndex } from "@/lib/events";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("events", {
    title: "Events",
    description: "Come for the talks, Stay for the adventure.",
  });
}

export default async function EventsPage() {
  const [events, t] = await Promise.all([getEventsIndex(), getTranslations("chrome")]);

  return (
    <>
      <PageHero label={t("events")} heading={events.heading} />
      {events.upcoming.length > 0 ? (
        <EventCards events={events.upcoming} label="Upcoming" title="" />
      ) : (
        <EmptyState label="Upcoming" title={events.subheading} />
      )}
      <EventCards events={events.past} label="Events" title="Previous events" />
    </>
  );
}
