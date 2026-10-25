/**
 * Lightweight seed for Consistency Academy only (avoids full catalog seed).
 * Usage: npm run payload -- run src/scripts/seed-consistency-academy.ts
 */
import { getPayload } from "payload";

import config from "@payload-config";
import { consistencyAcademySeed } from "../seed/consistency-academy";

const run = async () => {
  const payload = await getPayload({ config });
  const slug = consistencyAcademySeed.slug;

  const media = await payload.find({
    collection: "media",
    overrideAccess: true,
    limit: 12,
    sort: "-updatedAt",
  });
  const mediaIds = media.docs.map((doc) => doc.id);
  const pick = (i: number) => mediaIds[i % Math.max(mediaIds.length, 1)];

  const modules = consistencyAcademySeed.modules.map((mod, index) => {
    const videos =
      index === 0
        ? [
            {
              label: "Welcome — Sport is for Everyone",
              url: "https://www.youtube.com/watch?v=sq1E73L2LOM",
            },
          ]
        : index === 1
          ? [
              {
                label: "Pace — short practice clip",
                url: "https://youtu.be/8B0yWIfuhyY",
              },
            ]
          : [];

    const images =
      mediaIds.length === 0
        ? []
        : index === 0
          ? [
              { image: pick(0), caption: "Arrive with care" },
              { image: pick(1), caption: "Ground rules, not hustle" },
            ]
          : index === 2
            ? [
                { image: pick(2), caption: "Name the barriers" },
                { image: pick(3), caption: "Access & safety" },
                { image: pick(4), caption: "Belonging check" },
              ]
            : index === 3
              ? [{ image: pick(5), caption: "What continues" }]
              : [{ image: pick(index), caption: null }];

    return { ...mod, videos, images };
  });

  const existing = await payload.find({
    collection: "courses",
    overrideAccess: true,
    limit: 1,
    where: { slug: { equals: slug } },
  });

  const data = {
    ...consistencyAcademySeed,
    modules,
    _status: "published" as const,
    publishedAt: new Date().toISOString(),
  };

  if (existing.docs[0]) {
    await payload.update({
      collection: "courses",
      id: existing.docs[0].id,
      overrideAccess: true,
      draft: false,
      data,
    });
    console.log(`Updated course: ${slug}`);
  } else {
    await payload.create({
      collection: "courses",
      overrideAccess: true,
      draft: false,
      data,
    });
    console.log(`Created course: ${slug}`);
  }

  console.log(`Access code (Admin only): ${consistencyAcademySeed.accessCode}`);
  console.log(`Media attached from ${mediaIds.length} library files`);
};

try {
  await run();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
