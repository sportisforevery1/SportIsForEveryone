import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_PREFIX = "sife_course_";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type CourseAccessToken = {
  courseId: string;
  slug: string;
  exp: number;
  /** Module slugs the learner has opened (for sequential unlock). */
  opened: string[];
};

function secret(): string {
  return (
    process.env.COURSE_UNLOCK_SECRET ||
    process.env.PAYLOAD_SECRET ||
    "dev-course-unlock-secret-change-me"
  );
}

function cookieName(slug: string): string {
  return `${COOKIE_PREFIX}${slug.replace(/[^a-z0-9_-]/gi, "").toLowerCase()}`;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(token: CourseAccessToken): string {
  const body = Buffer.from(JSON.stringify(token), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(raw: string): CourseAccessToken | null {
  const [body, sig] = raw.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as CourseAccessToken;
    if (!parsed?.courseId || !parsed?.slug || !parsed?.exp) return null;
    if (Date.now() > parsed.exp) return null;
    return {
      courseId: String(parsed.courseId),
      slug: String(parsed.slug),
      exp: Number(parsed.exp),
      opened: Array.isArray(parsed.opened) ? parsed.opened.map(String) : [],
    };
  } catch {
    return null;
  }
}

export function codesMatch(provided: string, expected: string | null | undefined): boolean {
  if (!expected?.trim()) return false;
  const a = Buffer.from(provided.trim().toUpperCase());
  const b = Buffer.from(expected.trim().toUpperCase());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function buildAccessToken(
  courseId: string | number,
  slug: string,
  opened: string[] = [],
): CourseAccessToken {
  return {
    courseId: String(courseId),
    slug,
    exp: Date.now() + TTL_MS,
    opened: [...new Set(opened)],
  };
}

export async function getCourseAccess(slug: string): Promise<CourseAccessToken | null> {
  try {
    const jar = await cookies();
    const raw = jar.get(cookieName(slug))?.value;
    if (!raw) return null;
    const token = decode(raw);
    if (!token || token.slug !== slug) return null;
    return token;
  } catch {
    // Outside a request context (e.g. sitemap build).
    return null;
  }
}

/**
 * Cookie unlock and/or logged-in active enrolment + DB progress.
 * Prefer this for public course/module rendering.
 */
export async function resolveCourseAccess(slug: string): Promise<CourseAccessToken | null> {
  const cookieAccess = await getCourseAccess(slug);

  try {
    const { getSessionUser } = await import("@/lib/auth/session");
    const user = await getSessionUser();
    if (!user) return cookieAccess;

    const { getCms } = await import("@/lib/cms");
    const payload = await getCms();
    const courseResult = await payload.find({
      collection: "courses",
      where: {
        and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const course = courseResult.docs[0];
    if (!course) return cookieAccess;

    const { getActiveEnrolment } = await import("@/lib/academy/enrolment");
    const enrolment = await getActiveEnrolment(user.id, course.id);

    // Revoked learners must not keep access via an old device cookie.
    if (!enrolment) {
      const revoked = await payload.find({
        collection: "course-enrolments",
        where: {
          and: [
            { user: { equals: user.id } },
            { course: { equals: course.id } },
            { status: { equals: "revoked" } },
          ],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      if (revoked.docs[0]) return null;
      if (!cookieAccess) return null;
    }

    const { listOpenedModuleSlugs } = await import("@/lib/academy/progress");
    const dbOpened = await listOpenedModuleSlugs(user.id, course.id);
    const opened = [...new Set([...(cookieAccess?.opened || []), ...dbOpened])];

    return {
      courseId: String(course.id),
      slug,
      exp: cookieAccess?.exp || Date.now() + TTL_MS,
      opened,
    };
  } catch {
    return cookieAccess;
  }
}

export async function setCourseAccess(token: CourseAccessToken): Promise<void> {
  const jar = await cookies();
  jar.set(cookieName(token.slug), encode(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(token.exp),
  });
}

export async function clearCourseAccess(slug: string): Promise<void> {
  const jar = await cookies();
  jar.delete(cookieName(slug));
}

export async function markModuleOpened(slug: string, moduleSlug: string): Promise<CourseAccessToken | null> {
  const current = await getCourseAccess(slug);
  if (!current) return null;
  if (current.opened.includes(moduleSlug)) return current;
  const next = { ...current, opened: [...current.opened, moduleSlug] };
  await setCourseAccess(next);
  return next;
}

export type ModuleUnlockMode = "always" | "with_course" | "sequential";

export type PublicModule = {
  slug: string;
  unlockMode: ModuleUnlockMode;
};

/** Whether the learner may see the full module body. */
export function canViewModule(
  modules: PublicModule[],
  moduleSlug: string,
  access: CourseAccessToken | null,
): boolean {
  const index = modules.findIndex((m) => m.slug === moduleSlug);
  if (index < 0) return false;
  const mod = modules[index];
  if (mod.unlockMode === "always") return true;
  if (!access) return false;
  if (mod.unlockMode === "with_course") return true;
  // sequential: course unlocked + every previous module is openable and already opened (or always)
  for (let i = 0; i < index; i++) {
    const prev = modules[i];
    if (prev.unlockMode === "always") continue;
    if (!access.opened.includes(prev.slug)) return false;
  }
  return true;
}

/** Soft rate limit for unlock attempts (per process). */
const unlockHits = new Map<string, { count: number; reset: number }>();

export function unlockRateLimited(key: string, limit = 12, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const row = unlockHits.get(key);
  if (!row || now > row.reset) {
    unlockHits.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  row.count += 1;
  return row.count > limit;
}
