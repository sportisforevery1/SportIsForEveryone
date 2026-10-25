import { getCms } from "@/lib/cms";
import { cmsCache } from "@/lib/cms-cache";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { getPublishedPage } from "@/lib/pages";
import { published } from "@/lib/query";
import type { Collaboration, Page } from "@/payload-types";

export type AboutPage = {
  heading: string;
  body: Page["body"];
  portrait: MediaRef;
  statement: string;
  lead: string;
  founder: {
    name: string;
    image: MediaRef;
    paragraphs: string[];
    stats: Array<{ value: string; text: string }>;
  };
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
    body: page?.body ?? null,
    portrait: mediaSrc(page?.hero?.media) ?? fallbackPortrait,
    statement:
      page?.statement ||
      "Sport Is For Everyone is a transdisciplinary platform exploring the cultural, social and structural conditions that shape who sport is truly for.",
    lead:
      page?.lead ||
      "Through films, conversations, research, and collaborations, SIFE connects people who are making sport more inclusive.",
    founder: {
      name: page?.founder?.name || "Oumou Aidara",
      image: mediaSrc(page?.founder?.image) ?? fallbackPortrait,
      paragraphs: (page?.founder?.bio ||
        "Sport Is For Everyone was founded by Oumou Aidara, a Senegalese artist, writer, and triathlete based between Berlin and Dakar.")
        .split(/\n\s*\n/)
        .filter(Boolean),
      stats: (page?.founder?.stats || [
        { value: "37%", text: "of women participate in sport weekly in Europe" },
        { value: "85%", text: "of adolescent girls do not meet recommended activity levels" },
      ]).map((stat) => ({ value: stat.value, text: stat.text })),
    },
  };
}

export async function getWorkWithUsPage() {
  const [page, collaborations] = await Promise.all([
    getPublishedPage("work-with-us"),
    getPublishedCollaborations(),
  ]);

  const rawHeading = page?.hero?.heading || page?.title || "Work with us";
  const heading =
    /^work with us$/i.test(rawHeading.trim()) || /^work with US$/i.test(rawHeading.trim())
      ? "Work with us"
      : rawHeading;

  return {
    heading,
    subheading:
      page?.hero?.subheading ||
      page?.statement ||
      "Each collaboration is shaped through dialogue and grounded in SIFE’s framework.",
    body: page?.body ?? null,
    collaborations,
    collaboration: collaborations[0] ?? null,
  };
}

export async function getLegalPage(slug: "impressum" | "privacy") {
  const page = await getPublishedPage(slug);
  return {
    title: page?.hero?.heading || page?.title || slug,
    body: page?.body ?? null,
  };
}

function toPublicCollaboration(doc: Collaboration): PublicCollaboration {
  return {
    title: doc.title,
    summary: doc.summary || "",
    image: mediaSrc(doc.image),
  };
}

async function getPublishedCollaborations(): Promise<PublicCollaboration[]> {
  return cmsCache(["collaborations-published"], async () => {
    const payload = await getCms();
    const result = await payload.find({
      collection: "collaborations",
      where: published,
      depth: 1,
      limit: 12,
      sort: "-publishedAt",
    });
    return result.docs.map((doc) => toPublicCollaboration(doc as Collaboration));
  });
}
