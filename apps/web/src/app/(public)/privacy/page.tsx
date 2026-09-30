import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/editorial/PageHero";
import { RichText } from "@/components/editorial/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { getLegalPage } from "@/lib/about";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("privacy", { title: "Privacy" });
}

export default async function PrivacyPage() {
  const [page, t] = await Promise.all([getLegalPage("privacy"), getTranslations("chrome")]);
  if (!page.body) notFound();

  return (
    <>
      <PageHero label={t("legal")} heading={page.title} />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-20">
        <Reveal>
          <RichText data={page.body} className="max-w-3xl" />
        </Reveal>
      </section>
    </>
  );
}
