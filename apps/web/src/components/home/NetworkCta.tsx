import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

export async function NetworkCta() {
  const t = await getTranslations("home");

  return (
    <section className="bg-sife-lime px-5 py-16 text-sife-black md:px-12 md:py-[4.5rem]">
      <Reveal>
        <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
          <div>
            <h2 className="max-w-[45rem] text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] md:text-4xl">
              Are you part of a grassroots initiative?
            </h2>
            <p className="mt-3.5 max-w-[32.5rem] text-base leading-normal">
              Add your project to the global database and connect with the community
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/join" className="btn-coral">
              {t("joinNetwork")}
            </Link>
            <Link href="/events#upcoming" className="btn-outline">
              {t("findEvents")}
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
