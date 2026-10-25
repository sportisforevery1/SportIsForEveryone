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
  const [events, t] = await Promise.all([getEventsIndex(), getTranslations("chrome")]);

  return (
    <>
      <PageHero
        label={t("events")}
        heading={events.heading}
        subheading={events.subheading}
      />

      <nav
        aria-label="Event sections"
        className="flex flex-wrap gap-x-6 gap-y-2 border-y border-sife-white/15 px-4 py-3.5 sm:px-5 md:px-12"
      >
        <a
          href="#upcoming"
          className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-sife-lime hover:text-sife-white"
        >
          Upcoming
        </a>
        <a
          href="#past"
          className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-sife-white/70 hover:text-sife-lime"
        >
          Previous
        </a>
        <Link
          href="/work-with-us"
          className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-sife-white/70 hover:text-sife-lime"
        >
          Host with us
        </Link>
      </nav>

      <div id="upcoming" className="scroll-mt-[7.5rem]">
        {events.upcoming.length > 0 ? (
          <EventCards
            events={events.upcoming}
            label="Calendar"
            title="What's next"
            featuredFirst
            eager
          />
        ) : (
          <EmptyState label="Upcoming" title={events.subheading} />
        )}
      </div>

      <div id="past" className="scroll-mt-[7.5rem]">
        <EventCards
          events={events.past}
          label="Archive"
          title="Previous gatherings"
          tone="cream"
        />
      </div>
    </>
  );
}
