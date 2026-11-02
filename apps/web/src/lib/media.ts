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

/** Payload local uploads 404 on Vercel; map seeded files to public/seed until Blob is wired. */
function rewriteLocalMediaPath(pathname: string, filename?: string | null): string {
  const file =
    filename ||
    pathname.split("/").pop() ||
    "";
  if (!file) return pathname;

  const withoutPayloadSuffix = file.replace(/-\d+(\.[^.]+)$/, "$1");
  const shopMatch = withoutPayloadSuffix.match(/^sife-ed/i);
  if (shopMatch) return `/seed/shop/${withoutPayloadSuffix}`;
  if (pathname.startsWith("/api/media/file/")) return `/seed/${withoutPayloadSuffix}`;
  return pathname;
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
        src = rewriteLocalMediaPath(url.pathname, value.filename);
      }
    } catch {
      // keep absolute URL
    }
  } else if (src.startsWith("/api/media/file/")) {
    src = rewriteLocalMediaPath(src, value.filename);
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
