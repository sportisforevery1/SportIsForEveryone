import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EditorialArticle } from "@/components/editorial/EditorialArticle";
import { getStoryBySlug, getStorySlugs } from "@/lib/read";

export const revalidate = 60;

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) return { title: "Story | Sport is for Everyone" };

  return {
    title: `${story.seoTitle || story.title} | Sport is for Everyone`,
    description: story.seoDescription || undefined,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) notFound();

  const isAcademy = story.category === "education";
  const meta =
    isAcademy
      ? "Education"
      : story.seriesLabel && story.seriesLabel !== story.title
        ? story.seriesLabel
        : undefined;

  return (
    <EditorialArticle
      backHref={story.backHref}
      backLabel={story.backLabel}
      category={isAcademy ? "Academy" : story.categoryLabel}
      title={story.title}
      meta={meta}
      image={story.image}
      body={story.body}
      excerpt={story.excerpt}
    />
  );
}
