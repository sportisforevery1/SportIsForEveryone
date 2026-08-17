import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";

type RichTextProps = {
  data: unknown;
  className?: string;
};

export function RichText({ data, className }: RichTextProps) {
  if (!data || typeof data !== "object" || !("root" in data)) return null;

  return (
    <PayloadRichText
      data={data as never}
      className={`sife-prose ${className ?? ""}`.trim()}
    />
  );
}
