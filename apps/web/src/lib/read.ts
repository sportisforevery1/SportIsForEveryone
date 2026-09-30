import { getCms } from "@/lib/cms";
import type { EditorialItem } from "@/lib/editorial";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { getPublishedPage } from "@/lib/pages";
import { published } from "@/lib/query";
import type { Story } from "@/payload-types";

export type ReadStory = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  href: string;
  category: Story["category"];
  categoryLabel: string;
  series: Story["series"];
  seriesLabel: string | undefined;
  image: MediaRef | null;
  body: Story["body"];
  backHref: string;
  backLabel: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type StoriesIndex = {
  heading: string;
  subheading: string;
  series: EditorialItem[];
  more: EditorialItem[];
};

export type ReadIndex = {
  heading: string;
  subheading: string;
  items: EditorialItem[];
};

const storiesHero = {
  heading: "Stories across borders",
  subheading: "Sport, across lives and places.",
};

const whereSheStandsHero = {
  heading: "Where She Stands",
  subheading: "Stories by Women, for Women",
};

const educationHero = {
  heading: "Educational Materials",
  subheading: "We're building something worth reading. Coming soon.",
};

const seriesOrder: Record<NonNullable<Story["series"]>, number> = {
  dakar: 1,
  iten: 2,
};

export async function getStoriesIndex(): Promise<StoriesIndex> {
  const payload = await getCms();
  const [page, stories] = await Promise.all([
    getPublishedPage("stories"),
    payload.find({
      collection: "stories",
      where: { and: [published, { category: { equals: "borders" } }] },
      depth: 1,
      limit: 24,
      sort: "-publishedAt",
    }),
  ]);

  const volumes = stories.docs.filter(
    (story) => story.series === "dakar" || story.series === "iten",
  );
  const series = [...volumes]
    .sort((a, b) => (seriesOrder[a.series as "dakar" | "iten"] ?? 9) - (seriesOrder[b.series as "dakar" | "iten"] ?? 9))
    .map(toStoryItem);
  const more = stories.docs
    .filter((story) => story.series !== "dakar" && story.series !== "iten")
    .map(toStoryItem);

  return {
    heading: page?.hero?.heading || storiesHero.heading,
    subheading: page?.hero?.subheading || storiesHero.subheading,
    series,
    more,
  };
}

export async function getWhereSheStandsIndex(): Promise<ReadIndex> {
  return getCategoryIndex("where-she-stands", "where-she-stands", whereSheStandsHero);
}

export async function getEducationIndex(): Promise<ReadIndex> {
  return getCategoryIndex("education", "education", educationHero);
}

export async function getStoryBySlug(slug: string): Promise<ReadStory | null> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "stories",
    where: { and: [published, { slug: { equals: slug } }] },
    depth: 1,
    limit: 1,
  });

  const story = result.docs[0];
  return story ? toReadStory(story) : null;
}

export async function getStorySlugs(): Promise<string[]> {
  try {
    const payload = await getCms();
    const result = await payload.find({
      collection: "stories",
      where: published,
      limit: 100,
      depth: 0,
      select: { slug: true },
    });

    return result.docs.map((story) => story.slug);
  } catch {
    return [];
  }
}

async function getCategoryIndex(
  pageSlug: string,
  category: Story["category"],
  fallback: { heading: string; subheading: string },
): Promise<ReadIndex> {
  const payload = await getCms();
  const [page, stories] = await Promise.all([
    getPublishedPage(pageSlug),
    payload.find({
      collection: "stories",
      where: { and: [published, { category: { equals: category } }] },
      depth: 1,
      limit: 24,
      sort: "-publishedAt",
    }),
  ]);

  return {
    heading: page?.hero?.heading || fallback.heading,
    subheading: page?.hero?.subheading || fallback.subheading,
    items: stories.docs.map(toStoryItem),
  };
}

export function storyCategoryLabel(category: Story["category"]): string {
  if (category === "where-she-stands") return "Where She Stands";
  if (category === "education") return "Education";
  return "Stories across borders";
}

export function storySeriesLabel(series: Story["series"]): string | undefined {
  if (series === "dakar") return "Vol. 01 — Dakar";
  if (series === "iten") return "Vol. 02 — Iten";
  return undefined;
}

function storyBack(category: Story["category"]): { href: string; label: string } {
  if (category === "where-she-stands") {
    return { href: "/where-she-stands", label: "Where She Stands" };
  }
  if (category === "education") {
    return { href: "/academy", label: "Academy" };
  }
  return { href: "/stories", label: "Stories across borders" };
}

function toReadStory(story: Story): ReadStory {
  const back = storyBack(story.category);

  return {
    id: story.id,
    title: story.title,
    slug: story.slug,
    excerpt: story.excerpt || "",
    href: `/stories/${story.slug}`,
    category: story.category,
    categoryLabel: storyCategoryLabel(story.category),
    series: story.series,
    seriesLabel: storySeriesLabel(story.series),
    image: mediaSrc(story.cover),
    body: story.body,
    backHref: back.href,
    backLabel: back.label,
    seoTitle: story.seo?.title || null,
    seoDescription: story.seo?.description || story.excerpt || null,
  };
}

function toStoryItem(story: Story): EditorialItem {
  return {
    id: `story-${story.id}`,
    kind: "story",
    section: "Read",
    category: storyCategoryLabel(story.category),
    title: story.title,
    excerpt: story.excerpt || "",
    href: `/stories/${story.slug}`,
    image: mediaSrc(story.cover),
    publishedAt: story.publishedAt || story.createdAt,
    meta: storySeriesLabel(story.series),
  };
}
