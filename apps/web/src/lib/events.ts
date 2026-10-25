import { getCms } from "@/lib/cms";
import { cmsCache } from "@/lib/cms-cache";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { getPublishedPage } from "@/lib/pages";
import { published } from "@/lib/query";
import type { Event } from "@/payload-types";

export type PublicEvent = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  href: string;
  location: string | null;
  dateLabel: string;
  timing: Event["timing"];
  image: MediaRef | null;
  body: Event["body"];
  seoTitle: string | null;
  seoDescription: string | null;
};

export type EventsIndex = {
  heading: string;
  subheading: string;
  upcoming: PublicEvent[];
  past: PublicEvent[];
};

const eventsHero = {
  heading: "Upcoming at SIFE",
  subheading: "Come for the talks, Stay for the adventure.",
};

export async function getEventsIndex(): Promise<EventsIndex> {
  return cmsCache(["events-index"], async () => {
    const payload = await getCms();
    const [page, upcoming, past] = await Promise.all([
      getPublishedPage("events"),
      payload.find({
        collection: "events",
        where: { and: [published, { timing: { equals: "upcoming" } }] },
        depth: 1,
        limit: 24,
        sort: "startDate",
      }),
      payload.find({
        collection: "events",
        where: { and: [published, { timing: { equals: "past" } }] },
        depth: 1,
        limit: 24,
        sort: "-startDate",
      }),
    ]);

    return {
      heading: page?.hero?.heading || eventsHero.heading,
      subheading: page?.hero?.subheading || eventsHero.subheading,
      upcoming: upcoming.docs.map(toPublicEvent),
      past: past.docs.map(toPublicEvent),
    };
  });
}

export async function getEventBySlug(slug: string): Promise<PublicEvent | null> {
  return cmsCache(["event", slug], async () => {
    const payload = await getCms();
    const result = await payload.find({
      collection: "events",
      where: { and: [published, { slug: { equals: slug } }] },
      depth: 1,
      limit: 1,
    });

    const event = result.docs[0];
    return event ? toPublicEvent(event) : null;
  });
}

export async function getEventSlugs(): Promise<string[]> {
  try {
    const payload = await getCms();
    const result = await payload.find({
      collection: "events",
      where: published,
      limit: 100,
      depth: 0,
      select: { slug: true },
    });

    return result.docs.map((event) => event.slug);
  } catch {
    return [];
  }
}

export async function getRelatedEvents(slug: string, limit = 2): Promise<PublicEvent[]> {
  return cmsCache(["events-related", slug, String(limit)], async () => {
    const payload = await getCms();
    const result = await payload.find({
      collection: "events",
      where: { and: [published, { slug: { not_equals: slug } }] },
      depth: 1,
      limit,
      sort: "-startDate",
    });

    return result.docs.map(toPublicEvent);
  });
}

export function formatEventDate(start: string, end?: string | null): string {
  const startLabel = formatDay(start);
  if (!end) return startLabel;

  const endLabel = formatDay(end);
  if (startLabel === endLabel) return startLabel;
  return `${startLabel} – ${endLabel}`;
}

function formatDay(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function toPublicEvent(event: Event): PublicEvent {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    excerpt: event.excerpt || "",
    href: `/events/${event.slug}`,
    location: event.location || null,
    dateLabel: formatEventDate(event.startDate, event.endDate),
    timing: event.timing,
    image: mediaSrc(event.cover),
    body: event.body,
    seoTitle: event.seo?.title || null,
    seoDescription: event.seo?.description || event.excerpt || null,
  };
}
