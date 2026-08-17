import type { Metadata } from "next";

import { CollaborationCard } from "@/components/about/CollaborationCard";
import { WorkAccordion } from "@/components/about/WorkAccordion";
import { PageHero } from "@/components/editorial/PageHero";
import { RichText } from "@/components/editorial/RichText";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { getWorkWithUsPage } from "@/lib/about";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work with us | Sport is for Everyone",
  description: "Each collaboration is shaped through dialogue and grounded in SIFE’s framework.",
};

type WorkPageProps = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function WorkWithUsPage({ searchParams }: WorkPageProps) {
  const [{ sent }, page] = await Promise.all([searchParams, getWorkWithUsPage()]);

  return (
    <>
      <PageHero label="About" heading={page.heading} />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
        <Reveal>
          <WorkAccordion />
          {page.body ? (
            <div className="mt-16">
              <RichText data={page.body} className="max-w-3xl" />
            </div>
          ) : null}
          {sent ? (
            <p className="mt-16 max-w-xl text-2xl font-semibold uppercase tracking-tight text-sife-black">
              Thanks. We’ll be in touch shortly.
            </p>
          ) : (
            <div className="mt-16">
              <h2 className="text-3xl font-semibold uppercase tracking-tight text-sife-black md:text-5xl">
                Interested in working together?
              </h2>
              <InquiryForm type="work-with-us" next="/work-with-us" submitLabel="Send" />
            </div>
          )}
        </Reveal>
      </section>
      {page.collaboration ? <CollaborationCard collaboration={page.collaboration} /> : null}
    </>
  );
}
