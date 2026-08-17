import type { Field, FieldHook } from "payload";

export const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatSlug =
  (source: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === "string" && value.length > 0) {
      return slugify(value);
    }

    if (operation === "create" || !value) {
      const fallback = data?.[source];
      if (typeof fallback === "string" && fallback.length > 0) {
        return slugify(fallback);
      }
    }

    return value;
  };

export const slugField = (source = "title"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
  },
  hooks: {
    beforeValidate: [formatSlug(source)],
  },
});
