import type { MetadataRoute } from "next";

import { listPublicCourses } from "@/lib/courses";
import { absoluteUrl } from "@/lib/seo";
import { isShopPublic } from "@/lib/site-settings";

const paths = [
  "/",
  "/films",
  "/interviews",
  "/stories",
  "/where-she-stands",
  "/academy",
  "/events",
  "/database",
  "/join",
  "/about",
  "/work-with-us",
  "/donate",
  "/shop",
  "/impressum",
  "/privacy",
];

function entriesFor(path: string): MetadataRoute.Sitemap {
  const en = absoluteUrl(path);
  const de = absoluteUrl(path === "/" ? "/de" : `/de${path}`);
  return [
    {
      url: en,
      alternates: { languages: { en, de, "x-default": en } },
    },
    {
      url: de,
      alternates: { languages: { en, de, "x-default": en } },
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, shopPublic] = await Promise.all([
    listPublicCourses().catch(() => []),
    isShopPublic().catch(() => false),
  ]);
  const coursePaths = courses.flatMap((course) => [
    `/academy/${course.slug}`,
    ...course.modules
      .filter((m) => m.unlockMode === "always")
      .map((m) => `/academy/${course.slug}/${m.slug}`),
  ]);
  const publicPaths = shopPublic ? paths : paths.filter((path) => path !== "/shop");

  return [...publicPaths, ...coursePaths].flatMap(entriesFor);
}
