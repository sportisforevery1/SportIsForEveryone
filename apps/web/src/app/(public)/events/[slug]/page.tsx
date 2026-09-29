import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { RichText } from "@/components/editorial/RichText";
import { EventCards } from "@/components/events/EventCards";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import { getEventBySlug, getEventSlugs, getRelatedEvents } from "@/lib/events";

export const revalidate = 60;

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
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
  const meta = [event.dateLabel, event.location].filter(Boolean).join(" · ");

  return (
    <>
      <article className="px-5 pb-20 pt-16 md:px-12 md:pb-28 md:pt-24">
        <Reveal>
          <p className="mb-8">
            <HoverUnderline href="/events" className="text-sife-lime">
              Events
            </HoverUnderline>
          </p>
          <CategoryLabel>{event.timing === "upcoming" ? "Upcoming" : "Past event"}</CategoryLabel>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold uppercase leading-[0.94] tracking-[-0.03em] md:text-[3.5rem]">
            {event.title}
          </h1>
          {meta ? (
            <p className="mt-4 text-sm uppercase tracking-[0.16em] text-sife-white/60">{meta}</p>
          ) : null}
          {event.image ? (
            <Image
              src={event.image.src}
              alt={event.image.alt}
              width={event.image.width}
              height={event.image.height}
              className="mt-10 aspect-[16/9] w-full object-cover"
            />
          ) : null}
          {event.body ? (
            <div className="mt-12 max-w-3xl text-sife-white/80">
              <RichText data={event.body} />
            </div>
          ) : event.excerpt ? (
            <p className="mt-12 max-w-3xl text-base leading-relaxed text-sife-white/80 md:text-lg">
              {event.excerpt}
            </p>
          ) : null}
        </Reveal>
      </article>
      <EventCards events={related} label="Events" title="More events" />
    </>
  );
}
