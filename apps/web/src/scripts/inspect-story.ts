import { getPayload } from "payload";
import config from "@payload-config";

const run = async () => {
  const payload = await getPayload({ config });
  const r = await payload.find({
    collection: "stories",
    where: { slug: { equals: "vol-01-dakar" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const s = r.docs[0];
  const children = s?.body && typeof s.body === "object" && "root" in s.body
    ? (s.body as { root: { children: Array<{ type?: string; tag?: string; children?: Array<{ text?: string }> }> } }).root.children
    : [];
  console.log(
    JSON.stringify(
      {
        found: Boolean(s),
        excerpt: s?.excerpt,
        status: s?._status,
        childCount: children.length,
        preview: children.slice(0, 5).map((c) => ({
          type: c.type,
          tag: c.tag,
          text: c.children?.[0]?.text?.slice(0, 80),
        })),
      },
      null,
      2,
    ),
  );
  process.exit(0);
};

void run();
