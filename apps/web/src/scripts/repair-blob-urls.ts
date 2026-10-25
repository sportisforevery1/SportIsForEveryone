/**
 * Point media.url at public Vercel Blob URLs when the API file route 404s.
 * Usage (staging env loaded): npm run payload -- run src/scripts/repair-blob-urls.ts
 */
import { list } from "@vercel/blob";
import { getPayload } from "payload";
import config from "@payload-config";

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  throw new Error("BLOB_READ_WRITE_TOKEN is required");
}

const payload = await getPayload({ config });
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
  if (!blobUrl) {
    console.warn(`No blob for media id=${doc.id} file=${filename}`);
    continue;
  }
  if (doc.url === blobUrl) continue;

  await payload.update({
    collection: "media",
    id: doc.id,
    overrideAccess: true,
    data: { url: blobUrl },
  });
  updated += 1;
  console.log(`Updated ${filename} -> blob`);
}

console.log(`Repair complete. Updated ${updated}/${media.docs.length} media docs. Blobs seen: ${listed.blobs.length}`);
process.exit(0);
