import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import type { HomeEvent } from "@/lib/home";

export async function PreviousEvents({ events }: { events: HomeEvent[] }) {
  const t = await getTranslations("home");
  const tChrome = await getTranslations("chrome");
  if (events.length === 0) return null;

  return (
    <section className="px-5 py-20 md:px-12 md:py-28">
      <Reveal>
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <CategoryLabel>{tChrome("events")}</CategoryLabel>
            <h2 className="mt-3 text-3xl font-semibold uppercase tracking-tight md:text-5xl">
              {t("previousEvents")}
            </h2>
          </div>
          <HoverUnderline href="/events" className="text-sife-lime">
            {t("allEvents")}
          </HoverUnderline>
        </div>
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
              ) : null}
              <h3 className="mt-5 text-2xl font-semibold uppercase tracking-tight">
                {event.title}
              </h3>
              {event.location ? (
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-sife-white/55">
                  {event.location}
                </p>
              ) : null}
              {event.excerpt ? (
                <p className="mt-3 max-w-md text-sm leading-relaxed text-sife-white/75">
                  {event.excerpt}
                </p>
              ) : null}
              <p className="mt-5">
                <HoverUnderline href={event.href} className="text-sife-lime">
                  {t("readMore")}
                </HoverUnderline>
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
