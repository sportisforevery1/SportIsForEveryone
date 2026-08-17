import { getCms } from "@/lib/cms";
import { published } from "@/lib/query";
import type { Page } from "@/payload-types";

export async function getPublishedPage(slug: string): Promise<Page | null> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "pages",
    where: { and: [published, { slug: { equals: slug } }] },
    depth: 1,
    limit: 1,
  });

  return result.docs[0] ?? null;
}
