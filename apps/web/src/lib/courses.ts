import { cmsCache } from "@/lib/cms-cache";
import { getCms } from "@/lib/cms";
import {
  canViewModule,
  getCourseAccess,
  type CourseAccessToken,
  type ModuleUnlockMode,
} from "@/lib/academy/unlock";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { contact } from "@/lib/site";

export type CourseStatus = "building" | "waitlist" | "open" | "archived";

export type CourseModuleVideo = {
  label: string | null;
  url: string;
};

export type CourseModuleImage = {
  image: MediaRef;
  caption: string | null;
};

export type CourseModulePublic = {
  id: string;
  title: string;
  slug: string;
  teaser: string;
  unlockMode: ModuleUnlockMode;
  estimatedMinutes: number | null;
  /** CMS has videos (URLs hidden while locked). */
  hasVideo: boolean;
  /** CMS has images (assets hidden while locked). */
  hasImages: boolean;
  /** Video list only when unlocked. */
  videos: CourseModuleVideo[];
  /** Images only when unlocked. */
  images: CourseModuleImage[];
  /** Full body only when unlocked for this request. */
  body: unknown | null;
  locked: boolean;
};

export type CoursePublic = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: CourseStatus;
  statusLabel: string;
  format: string;
  hostedBy: string;
  ctaLabel: string;
  featured: boolean;
  cover: MediaRef | null;
  infoBody: unknown | null;
  accessHint: string | null;
  /** Whether this browser has a valid unlock cookie. */
  unlocked: boolean;
  modules: CourseModulePublic[];
  inquireHref: string;
  forgotCodeHref: string;
};

type CourseDoc = {
  id: number | string;
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  programStatus?: string | null;
  status?: string | null;
  format?: string | null;
  hostedBy?: string | null;
  ctaLabel?: string | null;
  featured?: boolean | null;
  cover?: unknown;
  infoBody?: unknown;
  accessCode?: string | null;
  accessHint?: string | null;
  modules?: Array<{
    id?: string | null;
    title?: string | null;
    slug?: string | null;
    teaser?: string | null;
    unlockMode?: string | null;
    estimatedMinutes?: number | null;
    videos?: Array<{ label?: string | null; url?: string | null; id?: string | null } | null> | null;
    images?: Array<{
      image?: unknown;
      caption?: string | null;
      id?: string | null;
    } | null> | null;
    body?: unknown;
  } | null> | null;
  _status?: string | null;
};

function statusLabel(status: CourseStatus): string {
  if (status === "open") return "Open";
  if (status === "waitlist") return "Waitlist";
  if (status === "archived") return "Archived";
  return "In development";
}

function asStatus(value: string | null | undefined): CourseStatus {
  if (value === "open" || value === "waitlist" || value === "archived" || value === "building") {
    return value;
  }
  return "building";
}

function asUnlockMode(value: string | null | undefined): ModuleUnlockMode {
  if (value === "always" || value === "sequential" || value === "with_course") return value;
  return "with_course";
}

/** Strip secrets before any public mapping. */
function stripSecret(doc: CourseDoc): CourseDoc {
  const { accessCode: _code, ...rest } = doc;
  return rest;
}

function mapModules(
  doc: CourseDoc,
  access: CourseAccessToken | null,
  includeBodies: boolean,
): CourseModulePublic[] {
  const raw = (doc.modules || []).filter(
    (m): m is NonNullable<typeof m> => Boolean(m?.title && m?.slug && m?.teaser),
  );
  const gate = raw.map((m) => ({
    slug: m.slug as string,
    unlockMode: asUnlockMode(m.unlockMode),
  }));

  return raw.map((m, index) => {
    const slug = m.slug as string;
    const unlocked = canViewModule(gate, slug, access);
    const videos = (m.videos || [])
      .filter((v): v is { label?: string | null; url: string } => Boolean(v?.url?.trim()))
      .map((v) => ({
        label: v.label?.trim() || null,
        url: v.url.trim(),
      }));
    const images = (m.images || [])
      .map((entry) => {
        const image = mediaSrc(entry?.image as never);
        if (!image) return null;
        return {
          image,
          caption: entry?.caption?.trim() || null,
        };
      })
      .filter((entry): entry is CourseModuleImage => Boolean(entry));
    return {
      id: m.id || `${slug}-${index}`,
      title: m.title as string,
      slug,
      teaser: m.teaser as string,
      unlockMode: asUnlockMode(m.unlockMode),
      estimatedMinutes: m.estimatedMinutes ?? null,
      hasVideo: videos.length > 0,
      hasImages: images.length > 0,
      videos: includeBodies && unlocked ? videos : [],
      images: includeBodies && unlocked ? images : [],
      body: includeBodies && unlocked ? (m.body ?? null) : null,
      locked: !unlocked,
    };
  });
}

function mapCourse(doc: CourseDoc, access: CourseAccessToken | null): CoursePublic | null {
  if (!doc.title || !doc.slug || !doc.summary) return null;
  const status = asStatus(doc.programStatus ?? doc.status);
  const safe = stripSecret(doc);
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    summary: doc.summary,
    status,
    statusLabel: statusLabel(status),
    format: doc.format?.trim() || "Course + info",
    hostedBy: doc.hostedBy?.trim() || "Sport is for Everyone",
    ctaLabel: doc.ctaLabel?.trim() || "Inquire",
    featured: Boolean(doc.featured),
    cover: mediaSrc(doc.cover as never),
    infoBody: safe.infoBody ?? null,
    accessHint: doc.accessHint?.trim() || "Code from your welcome email",
    unlocked: Boolean(access),
    modules: mapModules(doc, access, true),
    inquireHref: `mailto:${contact.email}?subject=${encodeURIComponent(`Academy — ${doc.title}`)}`,
    forgotCodeHref: `mailto:${contact.email}?subject=${encodeURIComponent(
      `Forgot Academy code — ${doc.title}`,
    )}&body=${encodeURIComponent(
      `Hi SIFE,\n\nI enrolled in ${doc.title} but I no longer have my access code. Please resend it.\n\nMy email:\n`,
    )}`,
  };
}

async function loadPublishedCourses(): Promise<CourseDoc[]> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "courses",
    where: {
      and: [
        { _status: { equals: "published" } },
        { programStatus: { not_equals: "archived" } },
      ],
    },
    limit: 50,
    depth: 1,
    sort: "-featured",
    overrideAccess: true,
  });
  return result.docs as unknown as CourseDoc[];
}

export function getPublishedCourses(): Promise<CourseDoc[]> {
  return cmsCache(["courses", "v3"], loadPublishedCourses);
}

/** Public course list without reading unlock cookies (safe for sitemap / static params). */
export async function listPublicCourses(): Promise<CoursePublic[]> {
  const docs = await getPublishedCourses();
  return docs
    .map((doc) => mapCourse(doc, null))
    .filter((c): c is CoursePublic => Boolean(c));
}

export async function getCourseBySlug(slug: string): Promise<CoursePublic | null> {
  const docs = await getPublishedCourses();
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) {
    // Direct fetch in case cache is cold after seed
    const payload = await getCms();
    const result = await payload.find({
      collection: "courses",
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
      },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    });
    const found = result.docs[0] as unknown as CourseDoc | undefined;
    if (!found) return null;
    const access = await getCourseAccess(slug);
    return mapCourse(found, access);
  }
  const access = await getCourseAccess(slug);
  return mapCourse(doc, access);
}

/** Server-only: verify unlock code against CMS (never call from client loaders). */
export async function verifyCourseAccessCode(
  slug: string,
  code: string,
): Promise<{ ok: true; courseId: string } | { ok: false; reason: "not_found" | "invalid" }> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "courses",
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const doc = result.docs[0] as unknown as CourseDoc | undefined;
  if (!doc?.accessCode) return { ok: false, reason: "not_found" };

  const { codesMatch } = await import("@/lib/academy/unlock");
  if (!codesMatch(code, doc.accessCode)) return { ok: false, reason: "invalid" };
  return { ok: true, courseId: String(doc.id) };
}

