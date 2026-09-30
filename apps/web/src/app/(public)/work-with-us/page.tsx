import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CollaborationCard } from "@/components/about/CollaborationCard";
import { NumberedBand } from "@/components/about/NumberedBand";
import { ServiceCards } from "@/components/about/ServiceCards";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { EnglishOriginalNote, EnglishOriginalNoteInk } from "@/components/editorial/EnglishOriginalNote";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { getWorkWithUsPage } from "@/lib/about";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("work-with-us", {
    title: "Work with us",
    description: "Each collaboration is shaped through dialogue and grounded in SIFE’s framework.",
  });
}

type WorkPageProps = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function WorkWithUsPage({ searchParams }: WorkPageProps) {
  const [{ sent }, page, t, tChrome, tWork] = await Promise.all([
    searchParams,
    getWorkWithUsPage(),
    getTranslations("forms"),
    getTranslations("chrome"),
    getTranslations("work"),
  ]);

  return (
    <>
      <section className="px-5 pb-14 pt-16 md:px-12 md:pt-20">
        <Reveal>
          <EnglishOriginalNote />
          <div className="grid items-end gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <CategoryLabel>{tChrome("about")}</CategoryLabel>
              <h1 className="mt-3.5 text-4xl font-semibold uppercase leading-[0.94] tracking-[-0.03em] md:text-[3.5rem]">
                {page.heading}
              </h1>
            </div>
            <p className="max-w-[32.5rem] text-base leading-normal text-sife-white/85 md:text-lg">{page.intro}</p>
          </div>
        </Reveal>
      </section>
      <ServiceCards services={page.services} />
      <NumberedBand label={tWork("howWeWork")} items={page.steps} />
      {page.collaboration ? <CollaborationCard collaboration={page.collaboration} /> : null}
      <section className="bg-sife-cream px-5 py-20 text-sife-ink md:px-12">
        <Reveal>
          <EnglishOriginalNoteInk />
          {sent ? (
            <p className="max-w-xl text-2xl font-semibold uppercase tracking-tight text-sife-black">{t("thanks")}</p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-sife-black md:text-4xl">
                  {tWork("interested")}
                </h2>
                <p className="mt-4 max-w-[27.5rem] text-[0.95rem] leading-relaxed text-sife-ink/80">
                  {tWork("interestedBody")}
                </p>
              </div>
              <InquiryForm type="work-with-us" next="/work-with-us" />
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
