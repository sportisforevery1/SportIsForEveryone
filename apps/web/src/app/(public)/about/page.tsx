import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EnglishOriginalNoteInk } from "@/components/editorial/EnglishOriginalNote";
import { Framework } from "@/components/about/Framework";
import { PortraitHero } from "@/components/about/PortraitHero";
import { SupportBand } from "@/components/about/SupportBand";
import { RichText } from "@/components/editorial/RichText";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { getAboutPage } from "@/lib/about";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("about", {
    title: "About",
    description:
      "Sport Is For Everyone is a transdisciplinary platform exploring the cultural, social and structural conditions that shape who sport is truly for.",
  });
}

type AboutPageProps = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const [{ sent }, page, t] = await Promise.all([
    searchParams,
    getAboutPage(),
    getTranslations("forms"),
  ]);

  return (
    <>
      <PortraitHero heading={page.heading} image={page.portrait} />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
        <Reveal>
          <EnglishOriginalNoteInk />
          {page.body ? <RichText data={page.body} className="max-w-3xl" /> : null}
        </Reveal>
      </section>
      <Framework />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
        <Reveal>
          {sent ? (
            <p className="max-w-xl text-2xl font-semibold uppercase tracking-tight text-sife-black">
              {t("thanks")}
            </p>
          ) : (
            <>
              <h2 className="text-3xl font-semibold uppercase tracking-tight text-sife-black md:text-5xl">
                Contact us
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed">
                Interested in working together? Fill out some info and we will be in touch shortly. We
                can’t wait to hear from you!
              </p>
              <InquiryForm type="contact" next="/about" />
            </>
          )}
        </Reveal>
      </section>
      <SupportBand />
    </>
  );
}
