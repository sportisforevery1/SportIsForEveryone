import type { Metadata } from "next";

import { JoinForm } from "@/components/database/JoinForm";
import { EmptyState } from "@/components/editorial/EmptyState";
import { PageHero } from "@/components/editorial/PageHero";
import { RichText } from "@/components/editorial/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { getJoinPage } from "@/lib/directory";

export const metadata: Metadata = {
  title: "Join the Database | Sport is for Everyone",
  description: "Let’s make sport for everyone together",
};

type JoinPageProps = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const [{ sent }, page] = await Promise.all([searchParams, getJoinPage()]);

  return (
    <>
      <PageHero label="Network" heading={page.heading} subheading={page.subheading} />
      {sent ? (
        <EmptyState
          label="Join the Database"
          title="Thanks. We'll review your project and be in touch."
        />
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
