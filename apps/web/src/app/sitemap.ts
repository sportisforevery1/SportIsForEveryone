import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

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
  "/impressum",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) => {
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
  });
}
