import type { Metadata } from "next";

import { getPublishedPage } from "@/lib/pages";
import { mediaSrc } from "@/lib/media";
import type { Media } from "@/payload-types";

const siteName = "Sport is for Everyone";
const defaultTitle = "Sport is for Everyone | Join the Movement for Inclusive Sport";
const defaultDescription =
  "Discover global stories, films, and initiatives promoting inclusive and accessible sport for all communities worldwide.";

type SeoGroup = {
  title?: string | null;
  description?: string | null;
  image?: (number | null) | Media;
} | null | undefined;

export function absoluteUrl(path = "/"): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata(
  seo: SeoGroup,
  fallback: { title: string; description?: string | null },
): Metadata {
  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description || defaultDescription;
  const image = mediaSrc(seo?.image);
  const ogImage = image ? absoluteUrl(image.src) : undefined;

  return {
    title: title.includes("Sport is for Everyone") ? title : `${title} | ${siteName}`,
    description,
    openGraph: {
      title,
      description,
      siteName,
      images: ogImage ? [{ url: ogImage, alt: image?.alt || title }] : undefined,
    },
  };
}

export function defaultMetadata(): Metadata {
  return {
    title: defaultTitle,
    description: defaultDescription,
    icons: { icon: "/brand/favicon.ico" },
  };
}

export async function cmsPageMetadata(
  slug: string,
  fallback: { title: string; description?: string | null },
): Promise<Metadata> {
  const page = await getPublishedPage(slug);
  return pageMetadata(page?.seo, {
    title: page?.hero?.heading || page?.title || fallback.title,
    description: fallback.description,
  });
}
