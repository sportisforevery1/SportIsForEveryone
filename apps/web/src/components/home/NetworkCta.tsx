import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

export async function NetworkCta() {
  const t = await getTranslations("home");

  return (
    <section className="sife-section bg-sife-lime px-5 text-sife-black md:px-12">
      <Reveal>
        <h2 className="sife-display max-w-3xl">
          Are you part of a grassroots initiative?
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed">
          Add your project to the global database and connect with the community
        </p>
        <Link href="/join" className="btn-coral mt-8 inline-flex">
          {t("joinNetwork")}
        </Link>
      </Reveal>
    </section>
  );
}
