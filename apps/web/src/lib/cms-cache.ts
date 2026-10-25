import { unstable_cache } from "next/cache";

/** Cache CMS reads across requests. Pages stay dynamic (next-intl headers), but DB is not hit every time. */
export function cmsCache<T>(key: string[], fn: () => Promise<T>, revalidate = 60): Promise<T> {
  return unstable_cache(fn, key, { revalidate, tags: key })();
}
