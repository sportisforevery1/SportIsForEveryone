import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { EventCards } from "@/components/events/EventCards";
import { Link } from "@/i18n/navigation";
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
  const [events, t, tEvents] = await Promise.all([
    getEventsIndex(),
    getTranslations("chrome"),
    getTranslations("events"),
  ]);

  return (
    <>
      <PageHero
        label={t("events")}
        heading={events.heading}
        subheading={events.subheading}
        compact
      />

      <nav
        aria-label={tEvents("sections")}
        className="flex flex-wrap justify-center gap-x-6 gap-y-2 border-y border-sife-cream/15 px-5 py-4 md:justify-start md:px-12"
      >
        <a
          href="#upcoming"
          className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-sife-lime hover:text-sife-white"
        >
          {tEvents("upcoming")}
        </a>
        <a
          href="#past"
          className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-sife-white/70 hover:text-sife-lime"
        >
          {tEvents("previous")}
        </a>
        <Link
          href="/work-with-us"
          className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-sife-white/70 hover:text-sife-lime"
        >
          {tEvents("host")}
        </Link>
      </nav>

      <div id="upcoming" className="scroll-mt-[7.5rem]">
        {events.upcoming.length > 0 ? (
          <EventCards
            events={events.upcoming}
            label={tEvents("calendar")}
            title={tEvents("whatsNext")}
            featuredFirst
            eager
          />
        ) : (
          <EmptyState label={tEvents("upcoming")} title={events.subheading} />
        )}
      </div>

      <div id="past" className="scroll-mt-[7.5rem]">
        <EventCards
          events={events.past}
          label={tEvents("archive")}
          title={tEvents("previousGatherings")}
          tone="cream"
        />
      </div>
    </>
  );
}
