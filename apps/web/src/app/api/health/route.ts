import { pingDatabase } from "@/lib/db-ping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = ["fra1"];
export const maxDuration = 15;

export async function GET() {
  try {
    const ms = await pingDatabase();
    return Response.json(
      { ok: true, ms },
      {
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  } catch {
    return Response.json({ ok: false }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}

export async function HEAD() {
  return GET();
}
