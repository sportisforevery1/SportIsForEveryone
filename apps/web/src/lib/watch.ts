import { getCms } from "@/lib/cms";
import type { EditorialItem } from "@/lib/editorial";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { getPublishedPage } from "@/lib/pages";
import { published } from "@/lib/query";
import type { Film, Interview } from "@/payload-types";

export type WatchFilm = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  href: string;
  location: string | null;
  year: number | null;
  runtime: string | null;
  videoUrl: string | null;
  image: MediaRef | null;
  credits: Film["credits"];
  body: Film["body"];
  seoTitle: string | null;
  seoDescription: string | null;
};

export type WatchInterview = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  href: string;
  guest: string | null;
  location: string | null;
  image: MediaRef | null;
  body: Interview["body"];
  seoTitle: string | null;
  seoDescription: string | null;
};

export type FilmCard = {
  id: number;
  title: string;
  excerpt: string;
  href: string;
  meta: string | null;
  runtime: string | null;
  image: MediaRef | null;
};

export type FilmsIndex = {
  heading: string;
  subheading: string;
  featured: WatchFilm | null;
  more: FilmCard[];
};

export type InterviewsIndex = {
  heading: string;
  subheading: string;
  items: EditorialItem[];
};

const filmsHero = {
  heading: "Films & Visual Stories",
  subheading: "An ongoing archive of films that move literally and metaphorically",
};

const interviewsHero = {
  heading: "Field Interviews",
  subheading: "Unscripted conversations / anyone, anywhere, as long as sport is part of the story.",
};

export async function getFilmsIndex(): Promise<FilmsIndex> {
  const payload = await getCms();
  const [page, featuredFilms, films] = await Promise.all([
    getPublishedPage("films"),
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
      limit: 24,
      sort: "-publishedAt",
    }),
  ]);

  const featuredDoc = featuredFilms.docs[0] ?? films.docs[0] ?? null;
  const more = films.docs.filter((film) => film.id !== featuredDoc?.id);

  return {
    heading: page?.hero?.heading || filmsHero.heading,
    subheading: page?.hero?.subheading || filmsHero.subheading,
    featured: featuredDoc ? toWatchFilm(featuredDoc) : null,
    more: more.map(toFilmCard),
  };
}

export async function getFilmBySlug(slug: string): Promise<WatchFilm | null> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "films",
    where: { and: [published, { slug: { equals: slug } }] },
    depth: 1,
    limit: 1,
  });

  const film = result.docs[0];
  return film ? toWatchFilm(film) : null;
}

export async function getRelatedFilms(slug: string, limit = 2): Promise<EditorialItem[]> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "films",
    where: { and: [published, { slug: { not_equals: slug } }] },
    depth: 1,
    limit,
    sort: "-publishedAt",
  });

  return result.docs.map(toFilmItem);
}

export async function getFilmSlugs(): Promise<string[]> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "films",
    where: published,
    limit: 100,
    depth: 0,
    select: { slug: true },
  });

  return result.docs.map((film) => film.slug);
}

export async function getInterviewsIndex(): Promise<InterviewsIndex> {
  const payload = await getCms();
  const [page, interviews] = await Promise.all([
    getPublishedPage("interviews"),
    payload.find({
      collection: "interviews",
      where: published,
      depth: 1,
      limit: 24,
      sort: "-publishedAt",
    }),
  ]);

  return {
    heading: page?.hero?.heading || interviewsHero.heading,
    subheading: page?.hero?.subheading || interviewsHero.subheading,
    items: interviews.docs.map(toInterviewItem),
  };
}

export async function getInterviewBySlug(slug: string): Promise<WatchInterview | null> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "interviews",
    where: { and: [published, { slug: { equals: slug } }] },
    depth: 1,
    limit: 1,
  });

  const interview = result.docs[0];
  return interview ? toWatchInterview(interview) : null;
}

export async function getInterviewSlugs(): Promise<string[]> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "interviews",
    where: published,
    limit: 100,
    depth: 0,
    select: { slug: true },
  });

  return result.docs.map((interview) => interview.slug);
}

function toWatchFilm(film: Film): WatchFilm {
  return {
    id: film.id,
    title: film.title,
    slug: film.slug,
    excerpt: film.excerpt || "",
    href: `/films/${film.slug}`,
    location: film.location || null,
    year: film.year ?? null,
    runtime: film.runtime || null,
    videoUrl: film.videoUrl || null,
    image: mediaSrc(film.poster),
    credits: film.credits,
    body: film.body,
    seoTitle: film.seo?.title || null,
    seoDescription: film.seo?.description || film.excerpt || null,
  };
}

function toWatchInterview(interview: Interview): WatchInterview {
  return {
    id: interview.id,
    title: interview.title,
    slug: interview.slug,
    excerpt: interview.excerpt || "",
    href: `/interviews/${interview.slug}`,
    guest: interview.guest || null,
    location: interview.location || null,
    image: mediaSrc(interview.cover),
    body: interview.body,
    seoTitle: interview.seo?.title || null,
    seoDescription: interview.seo?.description || interview.excerpt || null,
  };
}

function filmMeta(film: Film): string | undefined {
  const parts = [film.location, film.year ? String(film.year) : null, film.runtime].filter(Boolean);
  return parts.length ? parts.join(" · ") : undefined;
}

function toFilmCard(film: Film): FilmCard {
  const parts = [film.location, film.year ? String(film.year) : null].filter(Boolean);

  return {
    id: film.id,
    title: film.title,
    excerpt: film.excerpt || "",
    href: `/films/${film.slug}`,
    meta: parts.length ? parts.join(" · ") : null,
    runtime: film.runtime || null,
    image: mediaSrc(film.poster),
  };
}

function toFilmItem(film: Film): EditorialItem {
  return {
    id: `film-${film.id}`,
    kind: "film",
    section: "Watch",
    category: "Film",
    title: film.title,
    excerpt: film.excerpt || "",
    href: `/films/${film.slug}`,
    image: mediaSrc(film.poster),
    publishedAt: film.publishedAt || film.createdAt,
    meta: filmMeta(film),
  };
}

function toInterviewItem(interview: Interview): EditorialItem {
  const parts = [interview.guest, interview.location].filter(Boolean);

  return {
    id: `interview-${interview.id}`,
    kind: "interview",
    section: "Watch",
    category: "Interview",
    title: interview.title,
    excerpt: interview.excerpt || "",
    href: `/interviews/${interview.slug}`,
    image: mediaSrc(interview.cover),
    publishedAt: interview.publishedAt || interview.createdAt,
    meta: parts.length ? parts.join(" · ") : undefined,
  };
}
