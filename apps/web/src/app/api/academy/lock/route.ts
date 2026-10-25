import { NextResponse } from "next/server";

import { clearCourseAccess } from "@/lib/academy/unlock";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { slug?: string };
  try {
    body = (await request.json()) as { slug?: string };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    return NextResponse.json({ error: "required" }, { status: 400 });
  }

  await clearCourseAccess(slug);
  return NextResponse.json({ ok: true });
}
