import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Settings",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    mimeTypes: ["image/*"],
    // Compress on upload without extra DB size columns (imageSizes needs a DB push first).
    resizeOptions: {
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    },
    formatOptions: {
      format: "webp",
      options: { quality: 78 },
    },
  },
};
