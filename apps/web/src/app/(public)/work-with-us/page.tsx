import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CollaborationPortfolio } from "@/components/about/CollaborationPortfolio";
import { WorkPoints } from "@/components/about/WorkPoints";
import { EnglishOriginalNoteInk } from "@/components/editorial/EnglishOriginalNote";
import { PageHero } from "@/components/editorial/PageHero";
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
      <CollaborationPortfolio items={page.collaborations} />
      <WorkPoints />
      <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
        <Reveal>
          <EnglishOriginalNoteInk />
          {sent ? (
            <p className="max-w-xl text-2xl font-semibold uppercase tracking-tight text-sife-ink">
              {t("thanks")}
            </p>
          ) : (
            <div className="max-w-2xl">
              <h2 className="sife-display text-sife-ink">Interested in working together?</h2>
              <p className="mt-4 text-base text-sife-ink/75">
                Tell us a little about the project — we’ll get back to you.
              </p>
              <InquiryForm type="work-with-us" next="/work-with-us" />
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
