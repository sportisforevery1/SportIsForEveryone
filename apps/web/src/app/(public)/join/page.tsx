import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { JoinForm } from "@/components/database/JoinForm";
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
      <PageHero label={tChrome("network")} heading={page.heading} subheading={page.subheading} />
      {sent ? (
        <EmptyState label={tNav("join")} title={tForms("thanksJoin")} />
      ) : (
        <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
          <Reveal>
            {page.body ? <RichText data={page.body} /> : null}
            <JoinForm tags={page.tags} />
          </Reveal>
        </section>
      )}
    </>
  );
}
