import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { getEventsIndex } from "@/lib/events";

/** 1–3 upcoming gatherings + CTA — not a full past-events dump. */
export async function UpcomingStrip() {
  const [events, t] = await Promise.all([getEventsIndex(), getTranslations("home")]);
  const upcoming = events.upcoming.slice(0, 3);

  return (
    <section className="sife-section bg-sife-black px-5 md:px-12">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <CategoryLabel>{t("upcomingEvents")}</CategoryLabel>
            <h2 className="sife-display mt-3">{t("upcomingTitle")}</h2>
          </div>
          <Link
            href="/events"
            className="text-xs font-bold uppercase tracking-[0.18em] text-sife-lime transition hover:text-sife-white"
          >
            {t("findUpcomingEvents")} →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <p className="mt-8 max-w-xl text-sm text-sife-white/70">{t("upcomingEmpty")}</p>
        ) : (
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {upcoming.map((event) => (
              <li key={event.id}>
                <Link href={event.href} className="group block">
                  {event.image ? (
                    <Image
                      src={event.image.src}
                      alt={event.image.alt}
                      width={event.image.width}
                      height={event.image.height}
                      className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="aspect-[16/10] bg-sife-navy" />
                  )}
                  <p className="mt-4 text-[0.7rem] uppercase tracking-[0.16em] text-sife-lime">
                    {event.dateLabel}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold uppercase tracking-tight transition group-hover:text-sife-lime">
                    {event.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
