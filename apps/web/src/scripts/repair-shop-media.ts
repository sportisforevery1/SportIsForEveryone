/**
 * Replace oversized shop stills and point media.url at public Blob URLs.
 * Usage (staging env loaded): npm run payload -- run src/scripts/repair-shop-media.ts
 */
import fs from "fs";
import path from "path";

import { list } from "@vercel/blob";
import { getPayload } from "payload";
import config from "@payload-config";

import { mediaFiles, seedDir } from "../seed/content";

const payload = await getPayload({ config });
const token = process.env.BLOB_READ_WRITE_TOKEN;

function filenameWhere(file: string) {
  const stem = path.basename(file).replace(/\.[^.]+$/, "");
  return {
    or: [
      { filename: { equals: path.basename(file) } },
      { filename: { equals: `${stem}.png` } },
      { filename: { equals: `${stem}.jpg` } },
      { filename: { equals: `${stem}.jpeg` } },
      { filename: { equals: `${stem}.webp` } },
    ],
  };
}

const shopItems = Object.entries(mediaFiles).filter(([, item]) => item.file.startsWith("shop/"));

for (const [, item] of shopItems) {
  const filePath = path.join(seedDir, item.file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing seed file: ${filePath}`);
  }

  const existing = await payload.find({
    collection: "media",
    overrideAccess: true,
    limit: 1,
    where: filenameWhere(item.file),
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "media",
      id: existing.docs[0].id,
      overrideAccess: true,
      data: { alt: item.alt },
      filePath,
    });
    console.log(`Updated shop media ${item.file} id=${existing.docs[0].id}`);
  } else {
    const doc = await payload.create({
      collection: "media",
      overrideAccess: true,
      data: { alt: item.alt },
      filePath,
    });
    console.log(`Created shop media ${item.file} id=${doc.id}`);
  }
}

if (!token) {
  console.log("No BLOB_READ_WRITE_TOKEN; left media URLs as uploaded.");
  process.exit(0);
}

const listed = await list({ token, limit: 1000 });
const byName = new Map(listed.blobs.map((blob) => [blob.pathname.replace(/^\//, ""), blob.url]));

const media = await payload.find({
  collection: "media",
  overrideAccess: true,
  limit: 200,
  depth: 0,
});

let updated = 0;
for (const doc of media.docs) {
  const filename = doc.filename;
  if (!filename) continue;
  const blobUrl = byName.get(filename);
  if (!blobUrl || doc.url === blobUrl) continue;
  await payload.update({
    collection: "media",
    id: doc.id,
    overrideAccess: true,
    data: { url: blobUrl },
  });
  updated += 1;
  console.log(`URL ${filename} -> blob`);
}

console.log(`Shop media repair complete. Blob URLs set: ${updated}`);
process.exit(0);
