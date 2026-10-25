import { getCms } from "@/lib/cms";
import { cmsCache } from "@/lib/cms-cache";
import type { EditorialItem } from "@/lib/editorial";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { published } from "@/lib/query";
import { heroManifesto, manifesto as fallbackManifesto } from "@/lib/site";
import type { Event, Film, Interview, Story } from "@/payload-types";

export type { EditorialItem };

export type HomeEvent = {
  title: string;
  excerpt: string;
  href: string;
  location: string | null;
  image: MediaRef | null;
};

export type HomeFilm = {
  title: string;
  excerpt: string;
  href: string;
  location: string | null;
  year: number | null;
  runtime: string | null;
  image: MediaRef | null;
};

export type HomeData = {
  heroManifesto: string;
  manifesto: string;
  heroImage: MediaRef;
  featuredFilm: HomeFilm | null;
  latest: EditorialItem[];
  upcomingEvents: HomeEvent[];
  events: HomeEvent[];
};

const fallbackHero: MediaRef = {
  src: "/seed/IMG_1335.png",
  alt: "Athletes in motion",
  width: 2138,
  height: 1425,
};

export async function getHomeData(): Promise<HomeData> {
  return cmsCache(["home-data"], loadHomeData, 60);
}

async function loadHomeData(): Promise<HomeData> {
  const payload = await getCms();

  const [site, homePages, featuredFilms, films, stories, interviews, upcomingEvents, events] = await Promise.all([
    payload.findGlobal({ slug: "site", depth: 1 }),
    payload.find({
      collection: "pages",
      where: { and: [published, { slug: { equals: "home" } }] },
      depth: 2,
      limit: 1,
    }),
    payload.find({
      collection: "films",
      where: { and: [published, { featured: { equals: true } }] },
      depth: 1,
      limit: 1,
      sort: "-publishedAt",
    }),
    payload.find({
      collection: "films",
      where: published,
      depth: 1,
      limit: 6,
      sort: "-publishedAt",
    }),
    payload.find({
      collection: "stories",
      where: published,
      depth: 1,
      limit: 6,
      sort: "-publishedAt",
    }),
    payload.find({
      collection: "interviews",
      where: published,
      depth: 1,
      limit: 6,
      sort: "-publishedAt",
    }),
    payload.find({
      collection: "events",
      where: { and: [published, { timing: { equals: "upcoming" } }] },
      depth: 1,
      limit: 3,
      sort: "startDate",
    }),
    payload.find({
      collection: "events",
      where: { and: [published, { timing: { equals: "past" } }] },
      depth: 1,
      limit: 4,
      sort: "-startDate",
    }),
  ]);

  const home = homePages.docs[0];
  const heroImage = mediaSrc(home?.hero?.media) ?? fallbackHero;

  const featuredDoc = featuredFilms.docs[0] ?? films.docs[0];

  return {
    heroManifesto: site.heroManifesto || home?.hero?.heading || heroManifesto,
    manifesto: site.manifesto || fallbackManifesto,
    heroImage,
    featuredFilm: featuredDoc ? toFilm(featuredDoc) : null,
    latest: collectLatest(films.docs, stories.docs, interviews.docs),
    upcomingEvents: upcomingEvents.docs.map(toEvent),
    events: events.docs.map(toEvent),
  };
}

function toFilm(film: Film): HomeFilm {
  return {
    title: film.title,
    excerpt: film.excerpt || "",
    href: `/films/${film.slug}`,
    location: film.location || null,
    year: film.year ?? null,
    runtime: film.runtime || null,
    image: mediaSrc(film.poster),
  };
}

function toEvent(event: Event): HomeEvent {
  return {
    title: event.title,
    excerpt: event.excerpt || "",
    href: `/events/${event.slug}`,
    location: event.location || null,
    image: mediaSrc(event.cover),
  };
}

function collectLatest(films: Film[], stories: Story[], interviews: Interview[]): EditorialItem[] {
  const items: EditorialItem[] = [
    ...films.map((film) => ({
      id: `film-${film.id}`,
      kind: "film" as const,
      section: "Watch" as const,
      category: "Film",
      title: film.title,
      excerpt: film.excerpt || "",
      href: `/films/${film.slug}`,
      image: mediaSrc(film.poster),
      publishedAt: film.publishedAt || film.createdAt,
    })),
    ...stories.map((story) => ({
      id: `story-${story.id}`,
      kind: "story" as const,
      section: "Read" as const,
      category: storyCategory(story.category),
      title: story.title,
      excerpt: story.excerpt || "",
      href: `/stories/${story.slug}`,
      image: mediaSrc(story.cover),
      publishedAt: story.publishedAt || story.createdAt,
    })),
    ...interviews.map((interview) => ({
      id: `interview-${interview.id}`,
      kind: "interview" as const,
      section: "Watch" as const,
      category: "Interview",
      title: interview.title,
      excerpt: interview.excerpt || "",
      href: `/interviews/${interview.slug}`,
      image: mediaSrc(interview.cover),
      publishedAt: interview.publishedAt || interview.createdAt,
    })),
  ];

  return items
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 3);
}

function storyCategory(category: Story["category"]): string {
  if (category === "where-she-stands") return "Where She Stands";
  if (category === "education") return "Education";
  return "Story";
}
