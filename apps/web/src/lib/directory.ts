import { getCms } from "@/lib/cms";
import { parseDirectoryFilters, type DirectoryFilters, type DirectoryTag } from "@/lib/directory-query";
import { getPublishedPage } from "@/lib/pages";
import type { Project, Tag } from "@/payload-types";

export type { DirectoryFilters, DirectoryTag } from "@/lib/directory-query";
export { directoryHref, parseDirectoryFilters } from "@/lib/directory-query";

export type DirectoryProject = {
  id: number;
  name: string;
  slug: string;
  city: string | null;
  country: string | null;
  region: string | null;
  location: string;
  instagram: string | null;
  website: string | null;
  description: string;
  tags: DirectoryTag[];
};

export type DirectoryIndex = {
  heading: string;
  subheading: string;
  filters: DirectoryFilters;
  projects: DirectoryProject[];
  total: number;
  tags: DirectoryTag[];
  cities: string[];
  countries: string[];
  regions: string[];
};

const databaseHero = {
  heading: "Database",
  subheading: "Find the spaces that were built for you. Not the other way around.",
};

const publishedProject = {
  status: { equals: "published" as const },
};

export async function getDirectoryIndex(
  params: Record<string, string | string[] | undefined>,
): Promise<DirectoryIndex> {
  const payload = await getCms();
  const filters = parseDirectoryFilters(params);

  const [page, projects, tags] = await Promise.all([
    getPublishedPage("database"),
    payload.find({
      collection: "projects",
      where: publishedProject,
      depth: 1,
      limit: 100,
      sort: "name",
    }),
    payload.find({
      collection: "tags",
      limit: 100,
      sort: "name",
    }),
  ]);

  const all = projects.docs.map(toDirectoryProject);
  const filtered = all.filter((project) => matches(project, filters));

  return {
    heading: page?.hero?.heading || databaseHero.heading,
    subheading: page?.hero?.subheading || databaseHero.subheading,
    filters,
    projects: filtered,
    total: all.length,
    tags: tags.docs.map(toDirectoryTag),
    cities: unique(all.map((project) => project.city)),
    countries: unique(all.map((project) => project.country)),
    regions: unique(all.map((project) => project.region)),
  };
}

export async function getJoinPage() {
  const page = await getPublishedPage("join");
  const payload = await getCms();
  const tags = await payload.find({
    collection: "tags",
    limit: 100,
    sort: "name",
  });

  return {
    heading: page?.hero?.heading || "Let’s make sport for everyone together",
    subheading:
      page?.hero?.subheading ||
      "We’re in our launch phase right now, building the first version of our platform.",
    body: page?.body ?? null,
    tags: tags.docs.map(toDirectoryTag),
  };
}

function matches(project: DirectoryProject, filters: DirectoryFilters): boolean {
  if (filters.city && project.city !== filters.city) return false;
  if (filters.country && project.country !== filters.country) return false;
  if (filters.region && project.region !== filters.region) return false;

  if (filters.tags.length > 0) {
    const slugs = new Set(project.tags.map((tag) => tag.slug));
    if (!filters.tags.some((tag) => slugs.has(tag))) return false;
  }

  if (filters.q) {
    const haystack = [
      project.name,
      project.city,
      project.country,
      project.region,
      project.description,
      ...project.tags.map((tag) => tag.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(filters.q.toLowerCase())) return false;
  }

  return true;
}

function toDirectoryProject(project: Project): DirectoryProject {
  const tags = (project.tags || []).flatMap((tag) => (typeof tag === "object" ? [toDirectoryTag(tag)] : []));
  const location = [project.city, project.country].filter(Boolean).join(", ");

  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    city: project.city || null,
    country: project.country || null,
    region: project.region || null,
    location: location || project.region || "",
    instagram: project.instagram || null,
    website: project.website || null,
    description: project.description || "",
    tags,
  };
}

function toDirectoryTag(tag: Tag): DirectoryTag {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    group: tag.group,
  };
}

function unique(values: Array<string | null>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort((a, b) =>
    a.localeCompare(b),
  );
}
