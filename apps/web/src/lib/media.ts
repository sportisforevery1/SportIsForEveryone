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

  let src = value.url;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const url = new URL(src);
      if (
        url.pathname.startsWith("/api/media/") ||
        url.pathname.startsWith("/seed/") ||
        url.pathname.startsWith("/brand/")
      ) {
        src = url.pathname;
      }
    } catch {
      // keep absolute URL
    }
  }

  return {
    src,
    alt: value.alt || "Sport is for Everyone",
    width: value.width || 1600,
    height: value.height || 1066,
  };
}

export function isCdnMediaSrc(src: string): boolean {
  return src.includes("blob.vercel-storage.com");
}
