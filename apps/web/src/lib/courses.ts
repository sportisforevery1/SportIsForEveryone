import { cmsCache } from "@/lib/cms-cache";
import { getCms } from "@/lib/cms";
import {
  canViewModule,
  type CourseAccessToken,
  type ModuleUnlockMode,
} from "@/lib/academy/unlock";
import { mediaSrc, type MediaRef } from "@/lib/media";
import { contact } from "@/lib/site";

function progressPercent(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

export type CourseStatus = "building" | "waitlist" | "open" | "archived";

export type CourseModuleVideo = {
  label: string | null;
  url: string;
};

export type CourseModuleImage = {
  image: MediaRef;
  caption: string | null;
};

/** Public quiz — correct answers never included. */
export type CourseModuleQuizPublic = {
  prompt: string | null;
  questions: Array<{
    id: string;
    question: string;
    choices: Array<{ id: string; label: string }>;
    explanation: string | null;
  }>;
};

export type ModuleProgressStatus = "locked" | "ready" | "in_progress" | "done";

export type CourseModulePublic = {
  id: string;
  title: string;
  slug: string;
  teaser: string;
  unlockMode: ModuleUnlockMode;
  estimatedMinutes: number | null;
  hasVideo: boolean;
  hasImages: boolean;
  hasQuiz: boolean;
  /** Quiz without correct flags — only when unlocked. */
  quiz: CourseModuleQuizPublic | null;
  videos: CourseModuleVideo[];
  images: CourseModuleImage[];
  body: unknown | null;
  locked: boolean;
  opened: boolean;
  completed: boolean;
  status: ModuleProgressStatus;
};

export type CourseGalleryItem = {
  image: MediaRef;
  caption: string | null;
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
  /** Public workshop stills — no unlock / modules required. */
  gallery: CourseGalleryItem[];
  infoBody: unknown | null;
  accessHint: string | null;
  unlocked: boolean;
  modules: CourseModulePublic[];
  completedCount: number;
  moduleCount: number;
  progressPercent: number;
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
  gallery?: Array<{ image?: unknown; caption?: string | null; id?: string | null } | null> | null;
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
    quiz?: {
      prompt?: string | null;
      questions?: Array<{
        id?: string | null;
        question?: string | null;
        explanation?: string | null;
        choices?: Array<{
          id?: string | null;
          label?: string | null;
          correct?: boolean | null;
        } | null> | null;
      } | null> | null;
    } | null;
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

function stripSecret(doc: CourseDoc): CourseDoc {
  const { accessCode: _code, ...rest } = doc;
  return rest;
}

function mapQuizPublic(
  quiz: NonNullable<NonNullable<CourseDoc["modules"]>[number]>["quiz"],
): CourseModuleQuizPublic | null {
  const questions = (quiz?.questions || [])
    .filter((q): q is NonNullable<typeof q> => Boolean(q?.question?.trim()))
    .map((q, qi) => {
      const choices = (q.choices || [])
        .filter((c): c is NonNullable<typeof c> => Boolean(c?.label?.trim()))
        .map((c, ci) => ({
          id: c.id || `c-${qi}-${ci}`,
          label: c.label!.trim(),
        }));
      if (choices.length < 2) return null;
      return {
        id: q.id || `q-${qi}`,
        question: q.question!.trim(),
        choices,
        explanation: q.explanation?.trim() || null,
      };
    })
    .filter((q): q is NonNullable<typeof q> => Boolean(q));
  if (questions.length === 0) return null;
  return {
    prompt: quiz?.prompt?.trim() || "Check your understanding",
    questions,
  };
}

function moduleStatus(opts: {
  locked: boolean;
  opened: boolean;
  completed: boolean;
}): ModuleProgressStatus {
  if (opts.locked) return "locked";
  if (opts.completed) return "done";
  if (opts.opened) return "in_progress";
  return "ready";
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
  const openedSet = new Set(access?.opened || []);
  // `completed` lands when unlock cookies support it; until then treat opened as done.
  const completedSet = new Set(
    (access as CourseAccessToken & { completed?: string[] })?.completed ||
      access?.opened ||
      [],
  );

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
    const quizPublic = mapQuizPublic(m.quiz);
    const opened = openedSet.has(slug) || completedSet.has(slug);
    const completed = completedSet.has(slug);
    const locked = !unlocked;
    return {
      id: m.id || `${slug}-${index}`,
      title: m.title as string,
      slug,
      teaser: m.teaser as string,
      unlockMode: asUnlockMode(m.unlockMode),
      estimatedMinutes: m.estimatedMinutes ?? null,
      hasVideo: videos.length > 0,
      hasImages: images.length > 0,
      hasQuiz: Boolean(quizPublic),
      quiz: includeBodies && unlocked ? quizPublic : null,
      videos: includeBodies && unlocked ? videos : [],
      images: includeBodies && unlocked ? images : [],
      body: includeBodies && unlocked ? (m.body ?? null) : null,
      locked,
      opened,
      completed,
      status: moduleStatus({ locked, opened, completed }),
    };
  });
}

function mapGallery(doc: CourseDoc): CourseGalleryItem[] {
  return (doc.gallery || [])
    .map((entry) => {
      const image = mediaSrc(entry?.image as never);
      if (!image) return null;
      return {
        image,
        caption: entry?.caption?.trim() || null,
      };
    })
    .filter((entry): entry is CourseGalleryItem => Boolean(entry));
}

function mapCourse(doc: CourseDoc, access: CourseAccessToken | null): CoursePublic | null {
  if (!doc.title || !doc.slug || !doc.summary) return null;
  const status = asStatus(doc.programStatus ?? doc.status);
  const safe = stripSecret(doc);
  const modules = mapModules(doc, access, true);
  const completedCount = modules.filter((m) => m.completed).length;
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
    gallery: mapGallery(doc),
    infoBody: safe.infoBody ?? null,
    accessHint: doc.accessHint?.trim() || "Code from your welcome email",
    unlocked: Boolean(access),
    modules,
    completedCount,
    moduleCount: modules.length,
    progressPercent: progressPercent(completedCount, modules.length),
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
  return cmsCache(["courses", "v4-quiz"], loadPublishedCourses);
}

export async function listPublicCourses(): Promise<CoursePublic[]> {
  const docs = await getPublishedCourses();
  return docs.map((doc) => mapCourse(doc, null)).filter((c): c is CoursePublic => Boolean(c));
}

export async function getCourseBySlug(slug: string): Promise<CoursePublic | null> {
  const docs = await getPublishedCourses();
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) {
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
    const { resolveCourseAccess } = await import("@/lib/academy/unlock");
    const access = await resolveCourseAccess(slug);
    return mapCourse(found, access);
  }
  const { resolveCourseAccess } = await import("@/lib/academy/unlock");
  const access = await resolveCourseAccess(slug);
  return mapCourse(doc, access);
}

/** Server-only: full module quiz with correct flags for grading. */
export async function getModuleQuizForGrading(
  slug: string,
  moduleSlug: string,
): Promise<{
  courseId: string | number;
  questions: Array<{
    id: string;
    question: string;
    explanation: string | null;
    choices: Array<{ id: string; label: string; correct: boolean }>;
  }>;
} | null> {
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
  if (!doc) return null;
  const mod = (doc.modules || []).find((m) => m?.slug === moduleSlug);
  if (!mod?.quiz?.questions?.length) return null;
  const questions = (mod.quiz.questions || [])
    .filter((q): q is NonNullable<typeof q> => Boolean(q?.question?.trim()))
    .map((q, qi) => {
      const choices = (q.choices || [])
        .filter((c): c is NonNullable<typeof c> => Boolean(c?.label?.trim()))
        .map((c, ci) => ({
          id: c.id || `c-${qi}-${ci}`,
          label: c.label!.trim(),
          correct: Boolean(c.correct),
        }));
      return {
        id: q.id || `q-${qi}`,
        question: q.question!.trim(),
        explanation: q.explanation?.trim() || null,
        choices,
      };
    })
    .filter((q) => q.choices.length >= 2 && q.choices.some((c) => c.correct));
  if (questions.length === 0) return null;
  return { courseId: doc.id, questions };
}

export async function moduleHasQuiz(slug: string, moduleSlug: string): Promise<boolean> {
  const graded = await getModuleQuizForGrading(slug, moduleSlug);
  return Boolean(graded);
}

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
