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
    <section className="px-5 py-20 md:px-12">
      <Reveal>
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div>
            <CategoryLabel>{tChrome("events")}</CategoryLabel>
            <h2 className="mt-2.5 text-3xl font-semibold uppercase tracking-[-0.03em] md:text-4xl">
              {t("previousEvents")}
            </h2>
          </div>
          <HoverUnderline href="/events#upcoming" className="text-xs text-sife-lime">
            {`${t("findEvents")} →`}
          </HoverUnderline>
        </div>
        <ul className="grid gap-10 md:grid-cols-2 md:gap-8">
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
              <h3 className="mt-[1.125rem] text-[1.375rem] font-semibold uppercase tracking-[-0.03em]">
                {event.title}
              </h3>
              {event.location ? (
                <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-sife-white/60">
                  {event.location}
                </p>
              ) : null}
              {event.excerpt ? (
                <p className="mt-2.5 max-w-[28.75rem] text-sm leading-relaxed text-sife-white/80">
                  {event.excerpt}
                </p>
              ) : null}
              <p className="mt-3.5">
                <HoverUnderline href={event.href} className="text-xs text-sife-lime">
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
