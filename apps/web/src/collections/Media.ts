import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Settings",
    description: blobConfigured
      ? "Files store in Vercel Blob. Keep images under ~4.5MB (or use client upload)."
      : "WARNING: BLOB_READ_WRITE_TOKEN is missing — uploads will not preview after Save on Vercel.",
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
    // When Blob is configured, never write to ephemeral Vercel disk (that breaks preview after Save).
    disableLocalStorage: blobConfigured,
    mimeTypes: ["image/*", "video/*", "application/pdf"],
    adminThumbnail: ({ doc }) => {
      const url = typeof doc?.url === "string" ? doc.url : null;
      if (url && (url.includes("blob.vercel-storage.com") || url.startsWith("/"))) return url;
      return null;
    },
  },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        const url = typeof doc.url === "string" ? doc.url : "";
        if (url.includes("/api/media/file/")) {
          req.payload.logger.error(
            `Media id=${doc.id} saved without a Blob URL (${url}). Check BLOB_READ_WRITE_TOKEN on Vercel.`,
          );
        }
        return doc;
      },
    ],
  },
};
