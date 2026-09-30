import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { supportCopy } from "@/lib/site";

export async function SupportBand() {
  const t = await getTranslations("chrome");

  return (
    <section className="bg-sife-bg-deep px-5 py-20 md:px-12">
      <Reveal>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="max-w-[35rem] text-pretty text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] md:text-[2.125rem]">
              {supportCopy.heading}
            </h2>
            <Link href="/donate" className="btn-coral mt-7">
              {t("support")}
            </Link>
          </div>
          <div className="text-[0.95rem] leading-relaxed text-sife-white/85">
            <p>{supportCopy.intro}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {supportCopy.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="text-sife-lime">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-sife-white/60">{supportCopy.tax}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
