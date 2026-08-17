import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/editorial/PageHero";
import { RichText } from "@/components/editorial/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { getLegalPage } from "@/lib/about";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Impressum | Sport is for Everyone",
};

export default async function ImpressumPage() {
  const page = await getLegalPage("impressum");
  if (!page.body) notFound();

  return (
    <>
      <PageHero label="Legal" heading={page.title} />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
        <Reveal>
          <RichText data={page.body} className="max-w-3xl" />
        </Reveal>
      </section>
    </>
  );
}
