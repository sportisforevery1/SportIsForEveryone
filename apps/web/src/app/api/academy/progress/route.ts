import { NextResponse } from "next/server";

import { canViewModule, getCourseAccess, markModuleOpened } from "@/lib/academy/unlock";
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

  const access = await getCourseAccess(slug);
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

  // always modules can progress without a cookie; create a short-lived opener token if needed
  if (!access && modules.find((m) => m.slug === moduleSlug)?.unlockMode === "always") {
    const { buildAccessToken, setCourseAccess } = await import("@/lib/academy/unlock");
    await setCourseAccess(buildAccessToken(doc.id, slug, [moduleSlug]));
    return NextResponse.json({ ok: true });
  }

  await markModuleOpened(slug, moduleSlug);
  return NextResponse.json({ ok: true });
}
