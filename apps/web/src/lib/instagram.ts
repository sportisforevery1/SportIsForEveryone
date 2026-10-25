import { cmsCache } from "@/lib/cms-cache";
import { getCms } from "@/lib/cms";
import { mediaSrc } from "@/lib/media";
import type { InstagramPost as InstagramPostDoc } from "@/payload-types";
import { instagramManifest } from "@/seed/instagram-manifest";

export const instagramHandle = "sportisforevery1";
export const instagramProfileUrl = "https://www.instagram.com/sportisforevery1/";

export type InstagramPost = {
  id: string;
  src: string;
  alt: string;
  href: string;
  postedAt?: string;
  sort?: number;
};

type GraphMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

type GraphPage = {
  data?: GraphMedia[];
  paging?: { next?: string };
};

const graphLimit = 100;

function graphSrc(item: GraphMedia): string | null {
  if (item.media_type === "VIDEO") return item.thumbnail_url || item.media_url || null;
  return item.media_url || item.thumbnail_url || null;
}

function mapGraph(item: GraphMedia): InstagramPost | null {
  const src = graphSrc(item);
  if (!src) return null;
  return {
    id: item.id,
    src,
    alt: item.caption?.slice(0, 120) || "Sport is for Everyone on Instagram",
    href: item.permalink || instagramProfileUrl,
    postedAt: item.timestamp,
  };
}

async function fetchMetaPosts(token: string): Promise<InstagramPost[] | null> {
  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set("fields", "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp");
  url.searchParams.set("limit", "50");
  url.searchParams.set("access_token", token);

  const posts: InstagramPost[] = [];
  let next: string | null = url.toString();

  while (next && posts.length < graphLimit) {
    const response = await fetch(next, { next: { revalidate: 3600 } });
    if (!response.ok) return posts.length ? posts : null;
    const payload = (await response.json()) as GraphPage;
    for (const item of payload.data || []) {
      const mapped = mapGraph(item);
      if (mapped) posts.push(mapped);
      if (posts.length >= graphLimit) break;
    }
    next = payload.paging?.next || null;
  }

  return posts.length ? posts : null;
}

export async function fetchAllGraphMedia(token: string): Promise<GraphMedia[]> {
  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set("fields", "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp");
  url.searchParams.set("limit", "50");
  url.searchParams.set("access_token", token);

  const items: GraphMedia[] = [];
  let next: string | null = url.toString();

  while (next && items.length < graphLimit) {
    const response = await fetch(next, { cache: "no-store" });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Instagram Graph ${response.status}: ${body.slice(0, 240)}`);
    }
    const payload = (await response.json()) as GraphPage;
    items.push(...(payload.data || []));
    next = payload.paging?.next || null;
  }

  return items.slice(0, graphLimit);
}

function mapCms(doc: InstagramPostDoc): InstagramPost | null {
  const image = mediaSrc(doc.image);
  const src = image?.src || doc.remoteUrl || null;
  if (!src) return null;
  return {
    id: String(doc.externalId || doc.id),
    src,
    alt: doc.caption?.slice(0, 120) || doc.title || "Sport is for Everyone on Instagram",
    href: doc.permalink || instagramProfileUrl,
    postedAt: doc.postedAt || undefined,
    sort: Number(doc.sort || 0),
  };
}

function localManifestPosts(): InstagramPost[] {
  return instagramManifest.map((item) => ({
    id: item.id,
    src: `/seed/instagram/${item.file}`,
    alt: "Sport is for Everyone on Instagram",
    href: instagramProfileUrl,
    postedAt: item.postedAt,
  }));
}

function sortPosts(posts: InstagramPost[]): InstagramPost[] {
  return [...posts].sort((a, b) => {
    const sort = (b.sort || 0) - (a.sort || 0);
    if (sort) return sort;
    return String(b.postedAt || "").localeCompare(String(a.postedAt || ""));
  });
}

async function loadCmsRows(): Promise<InstagramPostDoc[]> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "instagram-posts",
    limit: 200,
    depth: 1,
    sort: "-postedAt",
    overrideAccess: true,
  });
  return result.docs;
}

async function loadCmsState(): Promise<{ published: InstagramPost[]; hiddenIds: Set<string> }> {
  try {
    const rows = await loadCmsRows();
    const hiddenIds = new Set(
      rows
        .filter((row) => row.status === "hidden")
        .map((row) => String(row.externalId || row.id)),
    );
    const published = rows
      .filter((row) => row.status === "published")
      .map(mapCms)
      .filter((item): item is InstagramPost => Boolean(item));
    return { published, hiddenIds };
  } catch {
    return { published: [], hiddenIds: new Set() };
  }
}

function mergeLive(live: InstagramPost[], published: InstagramPost[], hiddenIds: Set<string>): InstagramPost[] {
  const liveIds = new Set(live.map((post) => post.id));
  const visibleLive = live.filter((post) => !hiddenIds.has(post.id));
  const extras = published.filter((post) => !liveIds.has(post.id) && !hiddenIds.has(post.id));
  return sortPosts([...visibleLive, ...extras]);
}

/** Live Graph feed when INSTAGRAM_ACCESS_TOKEN is set; otherwise CMS, then local stills. */
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const cms = await cmsCache(["instagram-posts", "v1"], loadCmsState);
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();

  if (token) {
    try {
      const live = await fetchMetaPosts(token);
      if (live?.length) return mergeLive(live, cms.published, cms.hiddenIds);
    } catch {
      // CMS / local stills if Meta is unreachable.
    }
  }

  if (cms.published.length) return sortPosts(cms.published);
  return localManifestPosts();
}
