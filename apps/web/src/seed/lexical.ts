export type RichBlock =
  | { type: "h2" | "h3" | "h4" | "p"; text: string }
  | { type: "ul"; items: string[] };

const textNode = (text: string) => ({
  type: "text" as const,
  detail: 0,
  format: 0,
  mode: "normal" as const,
  style: "",
  text,
  version: 1,
});

const paragraph = (text: string) => ({
  type: "paragraph" as const,
  children: text ? [textNode(text)] : [],
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  textFormat: 0,
  textStyle: "",
  version: 1,
});

const heading = (tag: "h2" | "h3" | "h4", text: string) => ({
  type: "heading" as const,
  tag,
  children: [textNode(text)],
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  version: 1,
});

const list = (items: string[]) => ({
  type: "list" as const,
  listType: "bullet" as const,
  tag: "ul" as const,
  start: 1,
  children: items.map((item, index) => ({
    type: "listitem" as const,
    children: [paragraph(item)],
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    value: index + 1,
    version: 1,
  })),
  direction: "ltr" as const,
  format: "" as const,
  indent: 0,
  version: 1,
});

export const richText = (...blocks: Array<RichBlock | string>) => ({
  root: {
    type: "root" as const,
    children: blocks.map((block) => {
      if (typeof block === "string") return paragraph(block);
      if (block.type === "ul") return list(block.items);
      if (block.type === "p") return paragraph(block.text);
      return heading(block.type, block.text);
    }),
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    version: 1,
  },
});
