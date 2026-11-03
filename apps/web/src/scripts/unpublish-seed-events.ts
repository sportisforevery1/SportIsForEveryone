/**
 * Draft the known demo/seed events so they leave the public site.
 * Run from apps/web with production DATABASE_URL loaded:
 *   npx cross-env NODE_OPTIONS=--no-deprecation payload run src/scripts/unpublish-seed-events.ts
 */
import { getPayload } from "payload";

import config from "@payload-config";

const SEED_EVENT_SLUGS = [
  "berlin-screening-night",
  "city-edges-slow-walk",
  "academy-open-session",
  "shop-launch-evening",
  "summer-reading-circle",
  "database-meetup-spring",
] as const;

const run = async () => {
  console.log("unpublish-seed-events: starting");
  const payload = await getPayload({ config });
  let updated = 0;

  for (const slug of SEED_EVENT_SLUGS) {
    const existing = await payload.find({
      collection: "events",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const doc = existing.docs[0];
    if (!doc) {
      console.log(`skip missing: ${slug}`);
      continue;
    }
    await payload.update({
      collection: "events",
      id: doc.id,
      data: {
        _status: "draft",
        featured: false,
      },
      overrideAccess: true,
      draft: true,
    });
    updated += 1;
    console.log(`drafted: ${slug} (id=${doc.id})`);
  }

  console.log(`done — ${updated} event(s) drafted`);
  process.exit(0);
};

run().catch((err) => {
  console.error("unpublish-seed-events failed:", err);
  process.exit(1);
});
