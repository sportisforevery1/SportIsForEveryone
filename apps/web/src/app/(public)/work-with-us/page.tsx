import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CollaborationCard } from "@/components/about/CollaborationCard";
import { WorkAccordion } from "@/components/about/WorkAccordion";
import { EnglishOriginalNoteInk } from "@/components/editorial/EnglishOriginalNote";
import { PageHero } from "@/components/editorial/PageHero";
import { RichText } from "@/components/editorial/RichText";
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
  const [{ sent }, page, t, tChrome] = await Promise.all([
    searchParams,
    getWorkWithUsPage(),
    getTranslations("forms"),
    getTranslations("chrome"),
  ]);

  return (
    <>
      <PageHero label={tChrome("about")} heading={page.heading} />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
        <Reveal>
          <EnglishOriginalNoteInk />
          <WorkAccordion />
          {page.body ? (
            <div className="mt-16">
              <RichText data={page.body} className="max-w-3xl" />
            </div>
          ) : null}
          {sent ? (
            <p className="mt-16 max-w-xl text-2xl font-semibold uppercase tracking-tight text-sife-black">
              {t("thanks")}
            </p>
          ) : (
            <div className="mt-16">
              <h2 className="text-3xl font-semibold uppercase tracking-tight text-sife-black md:text-5xl">
                Interested in working together?
              </h2>
              <InquiryForm type="work-with-us" next="/work-with-us" />
            </div>
          )}
        </Reveal>
      </section>
      {page.collaboration ? <CollaborationCard collaboration={page.collaboration} /> : null}
    </>
  );
}
