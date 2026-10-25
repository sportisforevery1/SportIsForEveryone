import { getPayload } from "payload";
import config from "@payload-config";

import { fetchAllGraphMedia, instagramProfileUrl } from "../lib/instagram";

const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
if (!token) {
  console.error("Set INSTAGRAM_ACCESS_TOKEN to sync live posts into the CMS.");
  process.exit(1);
}

const payload = await getPayload({ config });
const media = await fetchAllGraphMedia(token);
console.log(`Graph returned ${media.length} items.`);

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
    status: "published" as const,
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
    console.log(`Updated ${item.id}`);
  } else {
    await payload.create({
      collection: "instagram-posts",
      overrideAccess: true,
      data,
    });
    console.log(`Created ${item.id}`);
  }
}

process.exit(0);
