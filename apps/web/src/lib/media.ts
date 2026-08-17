import type { Media } from "@/payload-types";

export type MediaRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function isMedia(value: unknown): value is Media {
  return typeof value === "object" && value !== null && "url" in value;
}

export function mediaSrc(value: number | Media | null | undefined): MediaRef | null {
  if (!isMedia(value) || !value.url) return null;

  return {
    src: value.url,
    alt: value.alt || "Sport is for Everyone",
    width: value.width || 1600,
    height: value.height || 1066,
  };
}
