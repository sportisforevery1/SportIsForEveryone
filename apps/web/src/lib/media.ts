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

/** Store id is not secret; it is already in every public Blob URL. */
function blobBaseUrl(): string | null {
  const configured = process.env.STORAGE_VERCEL_BLOB_BASE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  const storeId = process.env.BLOB_READ_WRITE_TOKEN?.match(
    /^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i,
  )?.[1]?.toLowerCase();
  return storeId ? `https://${storeId}.public.blob.vercel-storage.com` : null;
}

function fileNameFromPath(pathname: string, filename?: string | null): string {
  // The path is the object key Payload stored. The filename field can differ
  // (older Blob files were renamed in the URL only).
  const raw = pathname.split("/").pop() || filename || "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * Admin uploads land on Blob under the saved filename, but Payload often stores
 * /api/media/file/<filename>. That route 404s on Vercel. Follow the filename
 * the editor saved instead of remapping it onto /seed.
 */
function blobUrlForPayloadFile(pathname: string, filename?: string | null): string | null {
  if (!pathname.startsWith("/api/media/file/")) return null;
  const base = blobBaseUrl();
  const name = fileNameFromPath(pathname, filename);
  if (!base || !name) return null;
  return `${base}/${encodeURIComponent(name)}`;
}

export function mediaSrc(value: number | Media | null | undefined): MediaRef | null {
  if (!isMedia(value) || !value.url) return null;

  let src = value.url;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const url = new URL(src);
      if (url.pathname.startsWith("/api/media/file/")) {
        src = blobUrlForPayloadFile(url.pathname, value.filename) || src;
      } else if (url.pathname.startsWith("/seed/") || url.pathname.startsWith("/brand/")) {
        src = url.pathname;
      }
    } catch {
      // keep absolute URL
    }
  } else if (src.startsWith("/api/media/file/")) {
    src = blobUrlForPayloadFile(src, value.filename) || src;
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

/** Rewrite a stored Payload file route to the Blob object for that filename. */
export function resolveMediaUrl(src: string): string {
  if (!src.includes("/api/media/file/")) return src;
  try {
    const url =
      src.startsWith("http://") || src.startsWith("https://")
        ? new URL(src)
        : new URL(src, "http://localhost");
    return blobUrlForPayloadFile(url.pathname) || src;
  } catch {
    return src;
  }
}
