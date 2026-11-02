import { notFound } from "next/navigation";

import { getCms } from "@/lib/cms";
import { cmsCache } from "@/lib/cms-cache";

export type SiteSettings = {
  shopPublic: boolean;
};

async function loadSiteSettings(): Promise<SiteSettings> {
  const payload = await getCms();
  const site = await payload.findGlobal({ slug: "site", depth: 0 });
  return {
    // Missing / null → private (safe default for pitch / until admin opts in).
    shopPublic: Boolean(site.shopPublic),
  };
}

export function getSiteSettings(): Promise<SiteSettings> {
  return cmsCache(["site-settings", "v1"], loadSiteSettings, 30);
}

export async function isShopPublic(): Promise<boolean> {
  const settings = await getSiteSettings();
  return settings.shopPublic;
}

/** Block public shop pages when the Site global has shop turned off. */
export async function requireShopPublic(): Promise<void> {
  if (!(await isShopPublic())) notFound();
}
