import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditorialArticle } from "@/components/editorial/EditorialArticle";
import { getInterviewBySlug, getInterviewSlugs } from "@/lib/watch";

export const revalidate = 60;

type InterviewPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getInterviewSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
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

  return (
    <EditorialArticle
      backHref="/interviews"
      backLabel="Field Interviews"
      category="Field Interview"
      title={interview.title}
      meta={[interview.guest, interview.location].filter(Boolean).join(" · ") || undefined}
      image={interview.image}
      body={interview.body}
      excerpt={interview.excerpt}
    />
  );
}
