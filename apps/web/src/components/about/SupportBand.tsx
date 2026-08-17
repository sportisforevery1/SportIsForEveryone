import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { supportCopy } from "@/lib/site";

export async function SupportBand() {
  const t = await getTranslations("chrome");

  return (
    <section className="bg-sife-lime px-5 py-20 text-sife-black md:px-12 md:py-24">
      <Reveal>
        <h2 className="max-w-4xl text-3xl font-semibold uppercase leading-tight tracking-tight md:text-5xl">
          {supportCopy.heading}
        </h2>
        <p className="mt-6 text-base">{supportCopy.intro}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-base">
          {supportCopy.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed">{supportCopy.tax}</p>
        <Link href="/donate" className="btn-coral mt-8 inline-flex">
          {t("support")}
        </Link>
      </Reveal>
    </section>
  );
}
