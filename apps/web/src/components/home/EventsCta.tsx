import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

/** One clear path to events — not a second events grid. */
export async function EventsCta() {
  const t = await getTranslations("home");

  return (
    <section className="bg-sife-black px-5 py-14 md:px-12 md:py-16">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-6 border-t border-sife-lime/25 pt-8 md:flex-row md:items-end">
          <p className="text-2xl font-semibold uppercase tracking-tight text-sife-white md:text-3xl">
            {t("upcomingEvents")}
          </p>
          <Link
            href="/events"
            className="text-xs font-bold uppercase tracking-[0.18em] text-sife-lime transition hover:text-sife-white"
          >
            {t("findUpcomingEvents")} →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
