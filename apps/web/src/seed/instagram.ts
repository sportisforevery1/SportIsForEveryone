import fs from "fs";
import path from "path";

import type { Payload } from "payload";

import { instagramProfileUrl } from "../lib/instagram";
import { instagramManifest } from "./instagram-manifest";
import { seedDir } from "./content";

export async function seedInstagramPosts(payload: Payload) {
  const dir = path.join(seedDir, "instagram");
  if (!fs.existsSync(dir)) {
    console.log("Instagram: no seed stills, skipped.");
    return;
  }

  for (const item of instagramManifest) {
    const filePath = path.join(dir, item.file);
    if (!fs.existsSync(filePath)) {
      console.log(`Instagram: missing ${item.file}, skipped.`);
      continue;
    }

    const existingMedia = await payload.find({
      collection: "media",
      overrideAccess: true,
      limit: 1,
      where: { filename: { equals: item.file } },
    });

    const alt = "Sport is for Everyone on Instagram";
    const media = existingMedia.docs[0]
      ? await payload.update({
          collection: "media",
          id: existingMedia.docs[0].id,
          overrideAccess: true,
          data: { alt },
          filePath,
        })
      : await payload.create({
          collection: "media",
          overrideAccess: true,
          data: { alt },
          filePath,
        });

    const data = {
      title: `Instagram ${item.id}`,
      externalId: item.id,
      permalink: instagramProfileUrl,
      postedAt: item.postedAt,
      image: media.id,
      sort: 0,
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
    } else {
      await payload.create({
        collection: "instagram-posts",
        overrideAccess: true,
        data,
      });
    }

    console.log(`Instagram: ${item.file}`);
  }
}
