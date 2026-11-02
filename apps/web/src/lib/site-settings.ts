import { notFound } from "next/navigation";

import { getCms } from "@/lib/cms";
import { cmsCache } from "@/lib/cms-cache";

export type SiteSettings = {
  shopPublic: boolean;
};

async function loadSiteSettings(): Promise<SiteSettings> {
  try {
    const payload = await getCms();
    const site = await payload.findGlobal({ slug: "site", depth: 0 });
    return {
      // Missing / null → private (safe default for pitch / until admin opts in).
      shopPublic: Boolean(site.shopPublic),
    };
  } catch (error) {
    // Schema not pushed yet, DB blip, etc. Prefer private shop over a site-wide 500.
    console.error("site-settings: failed to load Site global", error);
    return { shopPublic: false };
  }
}

export function getSiteSettings(): Promise<SiteSettings> {
  return cmsCache(["site-settings", "v1"], loadSiteSettings, 30);
}

export async function isShopPublic(): Promise<boolean> {
  try {
    const settings = await getSiteSettings();
    return settings.shopPublic;
  } catch {
    return false;
  }
}

/** Block public shop pages when the Site global has shop turned off. */
export async function requireShopPublic(): Promise<void> {
  if (!(await isShopPublic())) notFound();
}
