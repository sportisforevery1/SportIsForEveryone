import { getCms } from "@/lib/cms";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { getPublishedPage } from "@/lib/pages";
import { published } from "@/lib/query";
import type { Collaboration } from "@/payload-types";

export type AboutPage = {
  heading: string;
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
  width: 1080,
  height: 1350,
};

export async function getAboutPage(): Promise<AboutPage> {
  const page = await getPublishedPage("about");

  return {
    heading: page?.hero?.heading || page?.title || "About",
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
