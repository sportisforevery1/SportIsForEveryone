import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

const webp = {
  format: "webp" as const,
  options: { quality: 78 },
};

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
    // Cap originals so Blob storage stays within Hobby limits.
    resizeOptions: {
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    },
    formatOptions: webp,
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        height: 480,
        fit: "inside",
        withoutEnlargement: true,
        formatOptions: webp,
      },
      {
        name: "card",
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
        formatOptions: webp,
      },
    ],
    adminThumbnail: "thumbnail",
  },
};
