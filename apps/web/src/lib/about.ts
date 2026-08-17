import { getCms } from "@/lib/cms";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { getPublishedPage } from "@/lib/pages";
import { published } from "@/lib/query";
import type { Collaboration, Page } from "@/payload-types";

export type AboutPage = {
  heading: string;
  body: Page["body"];
  portrait: MediaRef;
};

export type PublicCollaboration = {
  title: string;
  summary: string;
  image: MediaRef | null;
};

const fallbackPortrait: MediaRef = {
  src: "/seed/sport-is-for-everyone.png",
  alt: "Oumou Aidara",
  width: 1600,
  height: 1066,
};

export async function getAboutPage(): Promise<AboutPage> {
  const page = await getPublishedPage("about");

  return {
    heading: page?.hero?.heading || page?.title || "About",
    body: page?.body ?? null,
    portrait: mediaSrc(page?.hero?.media) ?? fallbackPortrait,
  };
}

export async function getWorkWithUsPage() {
  const [page, collaboration] = await Promise.all([
    getPublishedPage("work-with-us"),
    getFeaturedCollaboration(),
  ]);

  return {
    heading: page?.hero?.heading || page?.title || "Work with us",
    body: page?.body ?? null,
    collaboration,
  };
}

export async function getLegalPage(slug: "impressum" | "privacy") {
  const page = await getPublishedPage(slug);
  return {
    title: page?.hero?.heading || page?.title || slug,
    body: page?.body ?? null,
  };
}

async function getFeaturedCollaboration(): Promise<PublicCollaboration | null> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "collaborations",
    where: { and: [published, { featured: { equals: true } }] },
    depth: 1,
    limit: 1,
    sort: "-publishedAt",
  });

  const doc = result.docs[0] as Collaboration | undefined;
  if (!doc) return null;

  return {
    title: doc.title,
    summary: doc.summary || "",
    image: mediaSrc(doc.image),
  };
}
