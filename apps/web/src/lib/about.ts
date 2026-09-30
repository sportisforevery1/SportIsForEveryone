import { getCms } from "@/lib/cms";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { getPublishedPage } from "@/lib/pages";
import { published } from "@/lib/query";
import { aboutCopy, howWeWork, workIntro, workServices } from "@/lib/site";
import type { Collaboration } from "@/payload-types";

export type TitledText = { title: string; text: string };

export type AboutStat = { value: string; text: string };

export type AboutPage = {
  heading: string;
  portrait: MediaRef;
  statement: string;
  lead: string;
  founder: {
    name: string;
    image: MediaRef;
    paragraphs: string[];
    stats: AboutStat[];
  };
};

export type WorkService = TitledText & {
  project: string | null;
  image: MediaRef;
};

export type WorkWithUsPage = {
  heading: string;
  intro: string;
  services: WorkService[];
  steps: TitledText[];
  collaboration: PublicCollaboration | null;
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
  const founder = page?.founder;
  const bio = paragraphs(founder?.bio);
  const stats = (founder?.stats ?? []).map(({ value, text }) => ({ value, text }));

  return {
    heading: page?.hero?.heading || page?.title || "About",
    portrait: mediaSrc(page?.hero?.media) ?? fallbackPortrait,
    statement: page?.statement || aboutCopy.statement,
    lead: page?.lead || aboutCopy.intro,
    founder: {
      name: founder?.name || aboutCopy.founder.name,
      image: mediaSrc(founder?.image) ?? aboutCopy.founder.image,
      paragraphs: bio.length ? bio : [...aboutCopy.founder.paragraphs],
      stats: stats.length ? stats : aboutCopy.stats.map((stat) => ({ ...stat })),
    },
  };
}

export async function getWorkWithUsPage(): Promise<WorkWithUsPage> {
  const [page, collaboration] = await Promise.all([
    getPublishedPage("work-with-us"),
    getFeaturedCollaboration(),
  ]);

  // Cards without an uploaded photo keep the matching fallback photo.
  const services = (page?.services ?? []).map((service, index) => ({
    title: service.title,
    text: service.text,
    project: service.project || null,
    image: mediaSrc(service.image) ?? workServices[index % workServices.length].image,
  }));
  const steps = (page?.steps ?? []).map(({ title, text }) => ({ title, text }));

  return {
    heading: page?.hero?.heading || page?.title || "Work with us",
    intro: page?.statement || workIntro,
    services: services.length ? services : workServices.map((service) => ({ ...service })),
    steps: steps.length ? steps : howWeWork.map((step) => ({ ...step })),
    collaboration,
  };
}

function paragraphs(value: string | null | undefined): string[] {
  return (value ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
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
