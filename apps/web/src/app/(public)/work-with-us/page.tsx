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
  const [{ sent }, page, t, tWork] = await Promise.all([
    searchParams,
    getWorkWithUsPage(),
    getTranslations("forms"),
    getTranslations("work"),
  ]);

  return (
    <>
      <PageHero
        label="Collaborate"
        heading={page.heading}
        subheading={page.subheading}
        compact
      />
      <WorkPoints points={page.points} />
      <CollaborationPortfolio items={page.collaborations} />
      <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
        <Reveal>
          <EnglishOriginalNoteInk />
          {sent ? (
            <p className="max-w-xl text-2xl font-semibold uppercase tracking-tight text-sife-ink">
              {t("thanks")}
            </p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-16">
              <div>
                <h2 className="sife-display text-sife-ink">{tWork("interested")}</h2>
                <p className="mt-4 max-w-md text-base text-sife-ink/75">{tWork("interestedBody")}</p>
              </div>
              <InquiryForm type="work-with-us" next="/work-with-us" />
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
