import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { RichText } from "@/components/editorial/RichText";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import { getInterviewBySlug, getInterviewSlugs } from "@/lib/watch";

export const revalidate = 60;

type InterviewPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getInterviewSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: InterviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const interview = await getInterviewBySlug(slug);

  if (!interview) return { title: "Field Interview | Sport is for Everyone" };

  return {
    title: `${interview.seoTitle || interview.title} | Sport is for Everyone`,
    description: interview.seoDescription || undefined,
  };
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { slug } = await params;
  const interview = await getInterviewBySlug(slug);

  if (!interview) notFound();

  const meta = [interview.guest, interview.location].filter(Boolean).join(" · ");

  return (
    <article className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
      <Reveal>
        <p className="mb-8">
          <HoverUnderline href="/interviews" className="text-sife-navy">
            Field Interviews
          </HoverUnderline>
        </p>
        <CategoryLabel tone="navy">Field Interview</CategoryLabel>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold uppercase leading-[0.92] tracking-tight text-sife-black md:text-6xl">
          {interview.title}
        </h1>
        {meta ? (
          <p className="mt-4 text-sm uppercase tracking-[0.16em] text-sife-ink/55">{meta}</p>
        ) : null}
        {interview.image ? (
          <Image
            src={interview.image.src}
            alt={interview.image.alt}
            width={interview.image.width}
            height={interview.image.height}
            className="mt-10 aspect-[16/9] w-full object-cover"
          />
        ) : null}
        {interview.body ? (
          <div className="mt-12 max-w-3xl text-sife-ink">
            <RichText data={interview.body} />
          </div>
        ) : interview.excerpt ? (
          <p className="mt-12 max-w-3xl text-lg leading-relaxed text-sife-ink/80">
            {interview.excerpt}
          </p>
        ) : null}
      </Reveal>
    </article>
  );
}
