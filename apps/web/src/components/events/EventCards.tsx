import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import type { PublicEvent } from "@/lib/events";

type EventCardsProps = {
  events: PublicEvent[];
  label?: string;
  title?: string;
  tone?: "dark" | "cream";
  /** Emphasize the first event as a wide feature row */
  featuredFirst?: boolean;
  /** Skip scroll-wait fade for above-the-fold blocks */
  eager?: boolean;
};

function EventMedia({ event, sizes }: { event: PublicEvent; sizes: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-sife-navy/30">
      {event.image ? (
        <Image
          src={event.image.src}
          alt={event.image.alt}
          fill
          sizes={sizes}
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-sife-lime" />
      )}
    </div>
  );
}

export function EventCards({
  events,
  label,
  title,
  tone = "dark",
  featuredFirst = false,
  eager = false,
}: EventCardsProps) {
  if (events.length === 0) return null;

  const cream = tone === "cream";
  const featured = featuredFirst ? events[0] : null;
  const rest = featuredFirst ? events.slice(1) : events;

  return (
    <section
      className={
        cream
          ? "sife-section bg-sife-cream px-5 text-sife-ink md:px-12"
          : "sife-section px-5 md:px-12"
      }
    >
      <Reveal eager={eager}>
        {label || title ? (
          <div className="mb-8 sm:mb-10">
            {label ? <CategoryLabel tone={cream ? "navy" : "lime"}>{label}</CategoryLabel> : null}
            {title ? (
              <h2
                className={`sife-display mt-3 ${cream ? "text-sife-ink" : "text-sife-white"}`}
              >
                {title}
              </h2>
            ) : null}
          </div>
        ) : null}

        {featured ? (
          <Link
            href={featured.href}
            className={`group mb-12 grid items-center gap-6 border-b pb-12 md:mb-14 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-10 md:pb-14 ${
              cream ? "border-sife-ink/15" : "border-sife-white/15"
            }`}
          >
            <EventMedia event={featured} sizes="(min-width: 768px) 55vw, 100vw" />
            <div className="min-w-0">
              <p
                className={`text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
                  cream ? "text-sife-coral" : "text-sife-lime"
                }`}
              >
                Next up
                {featured.dateLabel ? ` · ${featured.dateLabel}` : ""}
              </p>
              <h3
                className={`mt-3 text-[clamp(1.35rem,3.2vw,2rem)] font-semibold uppercase leading-[0.98] tracking-[-0.03em] transition ${
                  cream
                    ? "text-sife-ink group-hover:text-sife-navy"
                    : "text-sife-white group-hover:text-sife-lime"
                }`}
              >
                {featured.title}
              </h3>
              {featured.location ? (
                <p
                  className={`mt-2 text-[0.65rem] uppercase tracking-[0.16em] ${
                    cream ? "text-sife-ink/55" : "text-sife-white/55"
                  }`}
                >
                  {featured.location}
                </p>
              ) : null}
              {featured.excerpt ? (
                <p
                  className={`mt-4 max-w-md text-sm leading-relaxed ${
                    cream ? "text-sife-ink/75" : "text-sife-white/75"
                  }`}
                >
                  {featured.excerpt}
                </p>
              ) : null}
              <p
                className={`mt-5 text-xs font-bold uppercase tracking-[0.16em] ${
                  cream ? "text-sife-navy" : "text-sife-lime"
                }`}
              >
                Details →
              </p>
            </div>
          </Link>
        ) : null}

        {rest.length > 0 ? (
          <ul className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:grid-cols-3">
            {rest.map((event) => (
              <li key={event.href} className="min-w-0">
                <Link href={event.href} className="group block h-full">
                  <EventMedia event={event} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 44vw, 100vw" />
                  <p
                    className={`mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
                      cream ? "text-sife-coral" : "text-sife-lime"
                    }`}
                  >
                    {[event.dateLabel, event.location].filter(Boolean).join(" · ")}
                  </p>
                  <h3
                    className={`mt-2 text-lg font-semibold uppercase leading-tight tracking-[-0.03em] transition sm:text-xl ${
                      cream
                        ? "text-sife-ink group-hover:text-sife-navy"
                        : "text-sife-white group-hover:text-sife-lime"
                    }`}
                  >
                    {event.title}
                  </h3>
                  {event.excerpt ? (
                    <p
                      className={`mt-2 line-clamp-3 text-sm leading-relaxed ${
                        cream ? "text-sife-ink/70" : "text-sife-white/70"
                      }`}
                    >
                      {event.excerpt}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>
    </section>
  );
}
