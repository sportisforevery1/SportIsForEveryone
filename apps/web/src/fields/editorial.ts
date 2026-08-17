import type { CollectionConfig, Field } from "payload";

export const featuredField: Field = {
  name: "featured",
  type: "checkbox",
  defaultValue: false,
  admin: {
    position: "sidebar",
    description: "Pin this on the home page or section landing.",
  },
};

export const publishedAtField: Field = {
  name: "publishedAt",
  type: "date",
  admin: {
    position: "sidebar",
    date: {
      pickerAppearance: "dayAndTime",
    },
  },
};

export const editorialVersions: CollectionConfig["versions"] = {
  drafts: true,
};

export const stampPublishedAt: CollectionConfig["hooks"] = {
  beforeChange: [
    ({ data, originalDoc }) => {
      if (data._status === "published" && !data.publishedAt) {
        data.publishedAt = originalDoc?.publishedAt ?? new Date().toISOString();
      }
      return data;
    },
  ],
};
