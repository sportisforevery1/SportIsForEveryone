import { NextResponse } from "next/server";

import { recordModuleOpened } from "@/lib/academy/progress";
import {
  buildAccessToken,
  canViewModule,
  getCourseAccess,
  markModuleOpened,
  resolveCourseAccess,
  setCourseAccess,
} from "@/lib/academy/unlock";
import { getSessionUser } from "@/lib/auth/session";
import { getCms } from "@/lib/cms";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { slug?: string; moduleSlug?: string };
  try {
    body = (await request.json()) as { slug?: string; moduleSlug?: string };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const moduleSlug = typeof body.moduleSlug === "string" ? body.moduleSlug.trim() : "";
  if (!slug || !moduleSlug) {
    return NextResponse.json({ error: "required" }, { status: 400 });
  }

  const access = await resolveCourseAccess(slug);
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
  const doc = result.docs[0];
  if (!doc) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const modules = (doc.modules || [])
    .filter((m): m is NonNullable<typeof m> => Boolean(m?.slug))
    .map((m) => ({
      slug: m.slug as string,
      unlockMode: (m.unlockMode || "with_course") as "always" | "with_course" | "sequential",
    }));

  if (!canViewModule(modules, moduleSlug, access)) {
    return NextResponse.json({ error: "locked" }, { status: 403 });
  }

  if (!access && modules.find((m) => m.slug === moduleSlug)?.unlockMode === "always") {
    await setCourseAccess(buildAccessToken(doc.id, slug, [moduleSlug]));
  } else if (await getCourseAccess(slug)) {
    await markModuleOpened(slug, moduleSlug);
  } else if (access) {
    // Enrolment-only (no cookie yet) — seed a cookie so sequential mode keeps working offline.
    await setCourseAccess(
      buildAccessToken(doc.id, slug, [...access.opened, moduleSlug]),
    );
  }

  const user = await getSessionUser();
  if (user) {
    await recordModuleOpened({
      userId: user.id,
      courseId: doc.id,
      moduleSlug,
    });
  }

  return NextResponse.json({ ok: true });
}
