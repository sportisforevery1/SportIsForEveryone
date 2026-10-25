import { RichText } from "@/components/editorial/RichText";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { Reveal } from "@/components/motion/Reveal";
import type { PublicEvent } from "@/lib/events";
import { contact } from "@/lib/site";

type EventArticleProps = {
  event: PublicEvent;
};

/**
 * Event detail — image-led gathering page.
 * Content types: status, title, when/where facts, lead, join CTA, programme body.
 */
export function EventArticle({ event }: EventArticleProps) {
  const upcoming = event.timing === "upcoming";
  const statusLabel = upcoming ? "Upcoming" : "Past event";
  const inquireHref = `mailto:${contact.email}?subject=${encodeURIComponent(`Event: ${event.title}`)}`;

  return (
    <article className="sife-event-article bg-sife-cream text-sife-ink">
      <p className="bg-sife-navy px-4 pb-3 pt-4 sm:px-6 md:px-12">
        <HoverUnderline href="/events" className="text-sife-lime">
          Events
        </HoverUnderline>
      </p>

      {event.image ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-sife-navy sm:aspect-[16/10] md:aspect-[21/9] md:max-h-[min(70vh,40rem)]">
          <ParallaxMedia
            src={event.image.src}
            alt={event.image.alt}
            width={event.image.width}
            height={event.image.height}
            priority
            className="absolute inset-0 h-full w-full"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sife-cream via-transparent to-sife-true-black/25"
            aria-hidden="true"
          />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-12">
        <Reveal>
          <header className={event.image ? "-mt-8 sm:-mt-12 md:-mt-16" : "pt-8"}>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sife-coral sm:text-[0.7rem]">
              Events · {statusLabel}
            </p>
            <h1 className="mt-3 text-[clamp(1.75rem,6.5vw,3.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-sife-ink break-words">
              {event.title}
            </h1>
          </header>

          <dl className="mt-8 grid grid-cols-1 gap-5 border-y border-sife-ink/15 py-6 sm:grid-cols-3 sm:gap-6 sm:py-8">
            <div className="min-w-0">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                When
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase leading-snug tracking-[-0.02em] text-sife-ink sm:text-base">
                {event.dateLabel || "Date TBA"}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                Where
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase leading-snug tracking-[-0.02em] text-sife-ink sm:text-base">
                {event.location || "Location TBA"}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                Status
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase leading-snug tracking-[-0.02em] text-sife-ink sm:text-base">
                {statusLabel}
              </dd>
            </div>
          </dl>

          {event.excerpt ? (
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-sife-ink/80 sm:mt-10 sm:text-xl">
              {event.excerpt}
            </p>
          ) : null}

          {upcoming ? (
            <div className="mt-8 flex flex-col gap-4 bg-sife-navy px-4 py-5 text-sife-white sm:mt-10 sm:flex-row sm:items-center sm:px-7 sm:py-6">
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
                  Join
                </p>
                <p className="mt-1 text-sm leading-relaxed text-sife-white/80">
                  Ask for access details, timing, and how to show up.
                </p>
              </div>
              <a href={inquireHref} className="btn-coral w-full text-center sm:w-auto sm:shrink-0">
                Inquire
              </a>
            </div>
          ) : (
            <p className="mt-8 text-xs uppercase tracking-[0.16em] text-sife-ink/50 sm:mt-10 sm:text-sm">
              Archive gathering — kept so past events stay readable.
            </p>
          )}

          {event.body ? (
            <div className="sife-prose mx-auto mt-10 max-w-3xl pb-16 text-sife-ink sm:mt-14 sm:pb-24 md:pb-28">
              <RichText data={event.body} />
            </div>
          ) : null}
        </Reveal>
      </div>
    </article>
  );
}
