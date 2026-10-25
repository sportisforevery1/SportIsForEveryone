import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Framework } from "@/components/about/Framework";
import { PortraitHero } from "@/components/about/PortraitHero";
import { SupportBand } from "@/components/about/SupportBand";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { EnglishOriginalNoteInk } from "@/components/editorial/EnglishOriginalNote";
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
  const [{ sent }, page, t, tForms, tWork] = await Promise.all([
    searchParams,
    getAboutPage(),
    getTranslations("about"),
    getTranslations("forms"),
    getTranslations("work"),
  ]);
  const { founder } = page;

  return (
    <>
      <PortraitHero heading={page.heading} image={page.portrait} />
      <section className="bg-sife-cream px-5 py-20 text-sife-ink md:px-12 md:py-[5.5rem]">
        <Reveal>
          <EnglishOriginalNoteInk />
          <h2 className="max-w-[68.75rem] text-pretty text-2xl font-semibold uppercase leading-[1.15] tracking-[-0.03em] text-sife-ink md:text-[2.125rem]">
            {page.statement}
          </h2>
          <p className="mt-7 max-w-[45rem] text-base leading-[1.65] text-sife-ink/85">{page.lead}</p>
        </Reveal>
      </section>
      <section className="px-5 py-20 md:px-12 md:py-[5.5rem]">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-[35rem_minmax(0,1fr)] lg:gap-16">
            <Image
              src={founder.image.src}
              alt={founder.image.alt}
              width={founder.image.width}
              height={founder.image.height}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[14/17] w-full object-cover"
            />
            <div>
              <CategoryLabel>{t("founderLabel")}</CategoryLabel>
              <h2 className="mt-3 text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] md:text-4xl">
                {founder.name}
              </h2>
              {founder.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`${index === 0 ? "mt-5" : "mt-3.5"} max-w-[35rem] text-[0.95rem] leading-[1.65] text-sife-white/85`}
                >
                  {paragraph}
                </p>
              ))}
              <dl className="mt-9 grid grid-cols-2 gap-8 border-t border-sife-white/20 pt-6">
                {founder.stats.map((stat) => (
                  <div key={stat.value}>
                    <dt className="text-[2.75rem] font-semibold leading-none tracking-[-0.04em] text-sife-lime md:text-[3.25rem]">
                      {stat.value}
                    </dt>
                    <dd className="mt-2.5 text-[0.8125rem] leading-normal text-sife-white/75">{stat.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>
      <Framework />
      <section className="bg-sife-cream px-5 py-20 text-sife-ink md:px-12">
        <Reveal>
          {sent ? (
            <p className="max-w-xl text-2xl font-semibold uppercase tracking-tight text-sife-black">{tForms("thanks")}</p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-sife-ink md:text-4xl">
                  {t("contactTitle")}
                </h2>
                <p className="mt-4 max-w-[27.5rem] text-[0.95rem] leading-relaxed text-sife-ink/80">
                  {tWork("interested")} {tWork("interestedBody")}
                </p>
              </div>
              <InquiryForm type="contact" next="/about" />
            </div>
          )}
        </Reveal>
      </section>
      <SupportBand />
    </>
  );
}
