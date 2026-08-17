import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import type { PublicEvent } from "@/lib/events";

type EventCardsProps = {
  events: PublicEvent[];
  label?: string;
  title?: string;
  tone?: "dark" | "cream";
};

export function EventCards({ events, label, title, tone = "dark" }: EventCardsProps) {
  if (events.length === 0) return null;

  const cream = tone === "cream";

  return (
    <section
      className={
        cream
          ? "bg-sife-cream px-5 py-20 text-sife-ink md:px-12 md:py-28"
          : "px-5 py-20 md:px-12 md:py-28"
      }
    >
      <Reveal>
        {label || title ? (
          <div className="mb-10">
            {label ? <CategoryLabel tone={cream ? "navy" : "lime"}>{label}</CategoryLabel> : null}
            {title ? (
              <h2
                className={`mt-3 text-3xl font-semibold uppercase tracking-tight md:text-5xl ${
                  cream ? "text-sife-black" : "text-sife-white"
                }`}
              >
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}
        <ul className="grid gap-8 md:grid-cols-2">
          {events.map((event) => (
            <li key={event.href}>
              {event.image ? (
                <Image
                  src={event.image.src}
                  alt={event.image.alt}
                  width={event.image.width}
                  height={event.image.height}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/10] bg-sife-lime" />
              )}
              <h3
                className={`mt-5 text-2xl font-semibold uppercase tracking-tight ${
                  cream ? "text-sife-black" : "text-sife-white"
                }`}
              >
                {event.title}
              </h3>
              <p
                className={`mt-2 text-xs uppercase tracking-[0.16em] ${
                  cream ? "text-sife-ink/55" : "text-sife-white/55"
                }`}
              >
                {[event.dateLabel, event.location].filter(Boolean).join(" · ")}
              </p>
              {event.excerpt ? (
                <p
                  className={`mt-3 max-w-md text-sm leading-relaxed ${
                    cream ? "text-sife-ink/80" : "text-sife-white/75"
                  }`}
                >
                  {event.excerpt}
                </p>
              ) : null}
              <p className="mt-5">
                <HoverUnderline href={event.href} className={cream ? "text-sife-navy" : "text-sife-lime"}>
                  Read more
                </HoverUnderline>
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
