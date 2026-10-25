import { getPublishedPage } from "@/lib/pages";
import { contact } from "@/lib/site";
import type { Page } from "@/payload-types";

/**
 * Academy — course + info page (Consistency Academy + future programs).
 * Editable in Payload Admin → Pages → Academy → Sections.
 */
export type AcademyProgram = {
  id: string;
  title: string;
  status: "open" | "building" | "waitlist";
  statusLabel: string;
  summary: string;
  points: string[];
  featured?: boolean;
};

export type AcademyPageData = {
  heading: string;
  subheading: string;
  intro: string;
  featured: AcademyProgram & {
    format: string;
    hostedBy: string;
    ctaLabel: string;
    courseBody: NonNullable<Page["academyFeatured"]>["courseBody"];
  };
  upcoming: AcademyProgram[];
  inquireHref: string;
};

const fallbacks = {
  heading: "Academy",
  subheading: "Courses and programs for moving with consistency, care, and community.",
  intro:
    "Academy is where SIFE turns practice into programs — starting with Consistency Academy, and growing into future courses as we build them.",
  featured: {
    title: "Consistency Academy",
    status: "building" as const,
    statusLabel: "In development",
    summary:
      "Our first Academy program — a course + info space for building sustainable movement habits without the usual performance pressure. Add syllabus, dates, and enrolment in Admin → Pages → Academy.",
    points: [
      "Course structure for steady practice over hustle culture",
      "Info hub: who it’s for, how it runs, and how to join",
      "Tied to SIFE’s wider work — films, gatherings, and the database",
    ],
    format: "Course + info",
    hostedBy: "Sport is for Everyone",
    ctaLabel: "Inquire",
    courseBody: null as NonNullable<Page["academyFeatured"]>["courseBody"],
  },
  upcoming: [
    {
      title: "Future programs",
      status: "building" as const,
      statusLabel: "Coming next",
      summary:
        "More Academy programs are being shaped — workshops, seasonal cohorts, and deeper courses. Add each one here when it’s ready to announce.",
      points: ["Cohorts & seasonal runs", "Host / facilitator tracks", "Partner programs"],
    },
  ],
};

function statusLabel(
  status: string | null | undefined,
  override: string | null | undefined,
): string {
  if (override?.trim()) return override.trim();
  if (status === "open") return "Open";
  if (status === "waitlist") return "Waitlist";
  return "In development";
}

function mapPoints(
  points: Array<{ text?: string | null } | null> | null | undefined,
  fallback: string[],
): string[] {
  const mapped = (points || []).map((p) => p?.text?.trim()).filter(Boolean) as string[];
  return mapped.length ? mapped : fallback;
}

export async function getAcademyPageData(): Promise<AcademyPageData> {
  const page = await getPublishedPage("academy");
  const featuredCms = page?.academyFeatured;
  const programsCms = page?.academyPrograms;

  const featuredTitle = featuredCms?.title?.trim() || fallbacks.featured.title;
  const featuredStatus = (featuredCms?.status || fallbacks.featured.status) as
    | "open"
    | "building"
    | "waitlist";

  const upcoming =
    programsCms && programsCms.length > 0
      ? programsCms.map((program, index) => {
          const status = (program.status || "building") as "open" | "building" | "waitlist";
          return {
            id: `program-${index}`,
            title: program.title,
            status,
            statusLabel: statusLabel(status, program.statusLabel),
            summary: program.summary,
            points: mapPoints(program.points, []),
          };
        })
      : fallbacks.upcoming.map((program, index) => ({
          id: `fallback-${index}`,
          ...program,
        }));

  return {
    heading: page?.hero?.heading || page?.title || fallbacks.heading,
    subheading: page?.hero?.subheading || fallbacks.subheading,
    intro: page?.statement?.trim() || fallbacks.intro,
    featured: {
      id: "featured",
      title: featuredTitle,
      status: featuredStatus,
      statusLabel: statusLabel(featuredStatus, featuredCms?.statusLabel),
      summary: featuredCms?.summary?.trim() || fallbacks.featured.summary,
      points: mapPoints(featuredCms?.points, fallbacks.featured.points),
      format: featuredCms?.format?.trim() || fallbacks.featured.format,
      hostedBy: featuredCms?.hostedBy?.trim() || fallbacks.featured.hostedBy,
      ctaLabel: featuredCms?.ctaLabel?.trim() || fallbacks.featured.ctaLabel,
      courseBody: featuredCms?.courseBody ?? null,
      featured: true,
    },
    upcoming,
    inquireHref: `mailto:${contact.email}?subject=${encodeURIComponent(`Academy — ${featuredTitle}`)}`,
  };
}
