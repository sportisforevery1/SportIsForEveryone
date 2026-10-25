import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
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
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-20">
        <Reveal>
          <p className="max-w-2xl text-lg leading-relaxed">{supportCopy.independent}</p>
          <p className="mt-8 text-base font-semibold uppercase tracking-[0.16em] text-sife-coral">
            {supportCopy.intro}
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed">
            {supportCopy.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 border-t border-sife-ink/15 pt-12 md:grid-cols-3">
            {supportCopy.how.map((block) => (
              <div key={block.title}>
                <CategoryLabel tone="navy">{block.title}</CategoryLabel>
                <p className="mt-3 text-base leading-relaxed text-sife-ink/80">{block.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-sife-ink/70">{supportCopy.tax}</p>
          <p className="mt-10 max-w-xl text-base leading-relaxed">
            Card donations are being set up. Until then, write to{" "}
            <a className="underline underline-offset-4" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>{" "}
            with the subject line <span className="font-semibold">Support SIFE</span>.
          </p>
        </Reveal>
      </section>
    </>
  );
}
