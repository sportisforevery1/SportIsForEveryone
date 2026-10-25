import { fetchAllGraphMedia, instagramProfileUrl } from "@/lib/instagram";
import { getCms } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim() || process.env.INSTAGRAM_SYNC_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  return header === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!token) {
    return Response.json({ ok: false, error: "missing_token" }, { status: 501 });
  }

  const media = await fetchAllGraphMedia(token);
  const payload = await getCms();
  let created = 0;
  let updated = 0;

  for (const item of media) {
    const src = item.media_type === "VIDEO" ? item.thumbnail_url || item.media_url : item.media_url;
    const caption = item.caption?.trim() || "";
    const data = {
      title: caption ? caption.slice(0, 80) : `Instagram ${item.id}`,
      externalId: item.id,
      caption: caption || null,
      permalink: item.permalink || instagramProfileUrl,
      postedAt: item.timestamp || null,
      remoteUrl: src || null,
    };

    const existing = await payload.find({
      collection: "instagram-posts",
      overrideAccess: true,
      limit: 1,
      where: { externalId: { equals: item.id } },
    });

    if (existing.docs[0]) {
      const current = existing.docs[0] as { status?: string };
      await payload.update({
        collection: "instagram-posts",
        id: existing.docs[0].id,
        overrideAccess: true,
        data: {
          ...data,
          status: current.status === "hidden" ? "hidden" : "published",
        },
      });
      updated += 1;
    } else {
      await payload.create({
        collection: "instagram-posts",
        overrideAccess: true,
        data: { ...data, status: "published" },
      });
      created += 1;
    }
  }

  return Response.json({ ok: true, fetched: media.length, created, updated });
}
