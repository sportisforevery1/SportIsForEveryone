import { getCms } from "@/lib/cms";
import { cmsCache } from "@/lib/cms-cache";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { getPublishedPage } from "@/lib/pages";
import { published } from "@/lib/query";
import type { Event } from "@/payload-types";

export type EventType = "talk" | "hike" | "run" | "open-session" | "camp" | "other";

export type PublicEvent = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  href: string;
  location: string | null;
  dateLabel: string;
  timing: Event["timing"];
  eventType: EventType;
  joinUrl: string | null;
  /** Opt-in: editor chose to also list this under Academy. */
  showOnAcademy: boolean;
  relatedCourseId: string | null;
  relatedCourseSlug: string | null;
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

/**
 * Demo / layout-seed events. Keep out of the public site even if still
 * published in CMS (seed re-upserts used to bring them back).
 */
/** Pure layout seeds only — never include slugs editors may have renamed in CMS. */
export const SEED_EVENT_SLUGS = [
  "berlin-screening-night",
  "city-edges-slow-walk",
  "academy-open-session",
  "summer-reading-circle",
  "database-meetup-spring",
] as const;

const seedSlugNotIn = {
  slug: { not_in: [...SEED_EVENT_SLUGS] },
};

function isSeedEventSlug(slug: string): boolean {
  return (SEED_EVENT_SLUGS as readonly string[]).includes(slug);
}

const eventsHero = {
  heading: "Upcoming at SIFE",
  subheading: "Come for the talks, Stay for the adventure.",
};

export async function getEventsIndex(): Promise<EventsIndex> {
  return cmsCache(["events-index", "hide-seed-v1"], async () => {
    const payload = await getCms();
    const [page, upcoming, past] = await Promise.all([
      getPublishedPage("events"),
      payload.find({
        collection: "events",
        where: { and: [published, { timing: { equals: "upcoming" } }, seedSlugNotIn] },
        depth: 1,
        limit: 24,
        sort: "startDate",
      }),
      payload.find({
        collection: "events",
        where: { and: [published, { timing: { equals: "past" } }, seedSlugNotIn] },
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
  if (isSeedEventSlug(slug)) return null;
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
      where: { and: [published, seedSlugNotIn] },
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

function relatedCourseRef(event: Event): { id: string | null; slug: string | null } {
  const related = (event as Event & { relatedCourse?: number | string | { id?: number | string; slug?: string | null } | null })
    .relatedCourse;
  if (!related) return { id: null, slug: null };
  if (typeof related === "object") {
    return {
      id: related.id != null ? String(related.id) : null,
      slug: related.slug?.trim() || null,
    };
  }
  return { id: String(related), slug: null };
}

function toPublicEvent(event: Event): PublicEvent {
  const course = relatedCourseRef(event);
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    excerpt: event.excerpt || "",
    href: `/events/${event.slug}`,
    location: event.location || null,
    dateLabel: formatEventDate(event.startDate, event.endDate),
    timing: event.timing,
    eventType: ((event as Event & { eventType?: EventType }).eventType || "other") as EventType,
    joinUrl: (event as Event & { joinUrl?: string | null }).joinUrl?.trim() || null,
    showOnAcademy: Boolean((event as Event & { showOnAcademy?: boolean | null }).showOnAcademy),
    relatedCourseId: course.id,
    relatedCourseSlug: course.slug,
    image: mediaSrc(event.cover),
    body: event.body,
    seoTitle: event.seo?.title || null,
    seoDescription: event.seo?.description || event.excerpt || null,
  };
}

/** Upcoming published events the editor opted to show under Academy. */
export async function listAcademyEvents(limit = 12): Promise<PublicEvent[]> {
  return cmsCache(["events-academy", "hide-seed-v1", String(limit)], async () => {
    try {
      const payload = await getCms();
      const result = await payload.find({
        collection: "events",
        where: {
          and: [
            published,
            { timing: { equals: "upcoming" } },
            { showOnAcademy: { equals: true } },
            seedSlugNotIn,
          ],
        },
        depth: 1,
        limit,
        sort: "startDate",
        overrideAccess: true,
      });
      return result.docs.map(toPublicEvent);
    } catch {
      // showOnAcademy column may be missing until schema push.
      return [];
    }
  });
}

/** Opted-in Academy gatherings linked to a specific course. */
export async function listCourseAcademyEvents(
  courseId: string | number,
  limit = 8,
): Promise<PublicEvent[]> {
  return cmsCache(["events-academy-course", "hide-seed-v1", String(courseId), String(limit)], async () => {
    try {
      const payload = await getCms();
      const result = await payload.find({
        collection: "events",
        where: {
          and: [
            published,
            { timing: { equals: "upcoming" } },
            { showOnAcademy: { equals: true } },
            { relatedCourse: { equals: courseId } },
            seedSlugNotIn,
          ],
        },
        depth: 1,
        limit,
        sort: "startDate",
        overrideAccess: true,
      });
      return result.docs.map(toPublicEvent);
    } catch {
      return [];
    }
  });
}
