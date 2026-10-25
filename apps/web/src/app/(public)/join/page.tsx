import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { JoinForm } from "@/components/database/JoinForm";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { RichText } from "@/components/editorial/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { getJoinPage } from "@/lib/directory";
import { cmsPageMetadata } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("join", {
    title: "Join the Database",
    description: "Let’s make sport for everyone together",
  });
}

type JoinPageProps = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const [{ sent }, page, tChrome, tNav, tForms] = await Promise.all([
    searchParams,
    getJoinPage(),
    getTranslations("chrome"),
    getTranslations("nav"),
    getTranslations("forms"),
  ]);

  return (
    <>
      <PageHero
        label={tChrome("network")}
        heading={page.heading}
        subheading={page.subheading}
        compact
      />
      {sent ? (
        <EmptyState
          label={tNav("join")}
          title={tForms("thanksJoin")}
          body="We’ll review your submission and get in touch if we need anything else."
        />
      ) : (
        <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
          <Reveal>
            <div className="mx-auto max-w-3xl">
              <CategoryLabel tone="navy">{tNav("join")}</CategoryLabel>
              <h2 className="sife-display mt-3 text-sife-ink">Tell us about your space</h2>
              {page.body ? (
                <div className="mt-5 max-w-2xl text-base leading-relaxed text-sife-ink/80">
                  <RichText data={page.body} />
                </div>
              ) : null}
              <div className="mt-8">
                <JoinForm tags={page.tags} />
              </div>
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}