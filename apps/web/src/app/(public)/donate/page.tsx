import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { contact, supportCopy } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support | Sport is for Everyone",
  description: supportCopy.heading,
};

export default async function DonatePage() {
  const t = await getTranslations("chrome");

  return (
    <>
      <PageHero label={t("support")} heading={t("support")} subheading={supportCopy.heading} />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
        <Reveal>
          <p className="max-w-2xl text-lg leading-relaxed">{supportCopy.independent}</p>
          <p className="mt-6 text-base">{supportCopy.intro}</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-base">
            {supportCopy.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed">{supportCopy.tax}</p>
          <p className="mt-10 max-w-xl text-base leading-relaxed">
            Card donations are being set up. Until then, write to{" "}
            <a className="underline underline-offset-4" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}
