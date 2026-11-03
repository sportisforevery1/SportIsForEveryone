import { Link } from "@/i18n/navigation";
import type { PublicEvent } from "@/lib/events";

type Props = {
  events: PublicEvent[];
  /** When true, show a quieter empty hint (course page). */
  emptyHint?: boolean;
  heading?: string;
};

function typeLabel(type: PublicEvent["eventType"]): string {
  if (type === "open-session") return "Open session";
  if (type === "camp") return "Camp";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function AcademyGatherings({
  events,
  emptyHint = false,
  heading = "On the Academy calendar",
}: Props) {
  if (events.length === 0) {
    if (!emptyHint) return null;
    return (
      <div className="mt-16 border-t border-sife-ink/15 pt-10">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
          Gatherings
        </p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-sife-ink/70">
          Live sessions for this program will appear here when the team lists them. Zoom and Meet
          links stay on each event page.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 border-t border-sife-ink/15 pt-10">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
        Gatherings
      </p>
      <h2 className="mt-3 text-[clamp(1.4rem,3vw,2rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em]">
        {heading}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-sife-ink/70">
        Selected gatherings only — chosen in Admin. Join opens Zoom or Google Meet in a new tab.
      </p>
      <ul className="mt-8 divide-y divide-sife-ink/15 border-t border-sife-ink/15">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sife-navy">
                  {typeLabel(event.eventType)}
                </span>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sife-ink/50">
                  {event.dateLabel}
                </span>
              </div>
              <h3 className="mt-2 text-xl font-semibold uppercase tracking-[-0.03em] text-sife-ink">
                {event.title}
              </h3>
              {event.location ? (
                <p className="mt-1 text-sm text-sife-ink/65">{event.location}</p>
              ) : null}
              {event.excerpt ? (
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-sife-ink/75">{event.excerpt}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              {event.joinUrl ? (
                <a
                  href={event.joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-coral text-center"
                >
                  Join call
                </a>
              ) : null}
              <Link
                href={event.href}
                className="text-xs font-bold uppercase tracking-[0.16em] text-sife-navy"
              >
                Event details →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
