import type { MediaRef } from "@/lib/media";

export type EditorialItem = {
  id: string;
  kind: "film" | "story" | "interview";
  section: "Watch" | "Read";
  category: string;
  title: string;
  excerpt: string;
  href: string;
  image: MediaRef | null;
  publishedAt: string;
  meta?: string;
};
