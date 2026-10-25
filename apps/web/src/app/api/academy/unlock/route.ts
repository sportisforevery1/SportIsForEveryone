import { NextResponse } from "next/server";

import { upsertCodeEnrolment } from "@/lib/academy/enrolment";
import {
  buildAccessToken,
  setCourseAccess,
  unlockRateLimited,
} from "@/lib/academy/unlock";
import { getSessionUser } from "@/lib/auth/session";
import { verifyCourseAccessCode } from "@/lib/courses";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (unlockRateLimited(`unlock:${ip}`)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { slug?: string; code?: string };
  try {
    body = (await request.json()) as { slug?: string; code?: string };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!slug || !code) {
    return NextResponse.json({ error: "required" }, { status: 400 });
  }

  const result = await verifyCourseAccessCode(slug, code);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 401 });
  }

  await setCourseAccess(buildAccessToken(result.courseId, slug));

  const user = await getSessionUser();
  if (user) {
    await upsertCodeEnrolment({ user, courseId: result.courseId, code });
  }

  return NextResponse.json({ ok: true, enrolled: Boolean(user) });
}
