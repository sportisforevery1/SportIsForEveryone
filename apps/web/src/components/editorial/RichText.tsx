import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";

import { resolveMediaUrl } from "@/lib/media";

type RichTextProps = {
  data: unknown;
  className?: string;
};

function rewriteStoredMedia(value: unknown): unknown {
  if (typeof value === "string") return resolveMediaUrl(value);
  if (Array.isArray(value)) return value.map(rewriteStoredMedia);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, rewriteStoredMedia(entry)]),
    );
  }
  return value;
}

export function RichText({ data, className }: RichTextProps) {
  if (!data || typeof data !== "object" || !("root" in data)) return null;

  return (
    <PayloadRichText
      data={rewriteStoredMedia(data) as never}
      className={`sife-prose ${className ?? ""}`.trim()}
    />
  );
}
