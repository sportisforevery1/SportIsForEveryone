import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Marquee } from "@/components/motion/Marquee";

/** Lime manifesto band + Find upcoming events (PDF: add CTA here too). */
export async function ManifestoBand({ text }: { text: string }) {
  const t = await getTranslations("home");

  return (
    <div className="border-y border-sife-true-black/10 bg-sife-lime text-sife-true-black">
      <div className="flex flex-col gap-3 px-5 py-3 md:flex-row md:items-center md:gap-8 md:px-12">
        <div className="min-w-0 flex-1 overflow-hidden">
          <Marquee
            text={text}
            className="py-0 text-sm font-semibold uppercase tracking-[0.18em] text-sife-true-black"
          />
        </div>
        <Link
          href="/events"
          className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-sife-true-black underline decoration-sife-true-black/30 underline-offset-4 transition hover:decoration-sife-true-black"
        >
          {t("findUpcomingEvents")} →
        </Link>
      </div>
    </div>
  );
}
