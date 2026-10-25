import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EventArticle } from "@/components/events/EventArticle";
import { EventCards } from "@/components/events/EventCards";
import { getEventBySlug, getEventSlugs, getRelatedEvents } from "@/lib/events";

export const revalidate = 60;

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getEventSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return { title: "Event | Sport is for Everyone" };

  return {
    title: `${event.seoTitle || event.title} | Sport is for Everyone`,
    description: event.seoDescription || undefined,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const related = await getRelatedEvents(event.slug);

  return (
    <>
      <EventArticle event={event} />
      <EventCards events={related} label="Events" title="More gatherings" tone="cream" />
    </>
  );
}
