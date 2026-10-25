import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";
import { authenticatedOrPublishedStatus } from "../access/authenticatedOrPublished";

const stampTitle: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data;
  if (!data.title) {
    const caption = typeof data.caption === "string" ? data.caption.trim() : "";
    data.title = caption ? caption.slice(0, 80) : "Instagram post";
  }
  return data;
};

export const InstagramPosts: CollectionConfig = {
  slug: "instagram-posts",
  labels: {
    singular: "Instagram post",
    plural: "Instagram posts",
  },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "postedAt", "status", "updatedAt"],
    description:
      "Homepage Instagram ribbon. Published posts show when there is no live token. With INSTAGRAM_ACCESS_TOKEN, the Graph API feed is used and Hidden rows (matched by External ID) are excluded. You can also add extra stills here.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublishedStatus,
    update: authenticated,
  },
  defaultSort: "-postedAt",
  hooks: {
    beforeValidate: [stampTitle],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Admin label. Defaults from the caption if you leave it blank.",
      },
    },
    {
      name: "externalId",
      type: "text",
      unique: true,
      admin: {
        description: "Instagram media ID. Used to hide a live API post or skip duplicates when syncing.",
      },
    },
    {
      name: "caption",
      type: "textarea",
    },
    {
      name: "permalink",
      type: "text",
      admin: {
        description: "Link opened from the homepage. Falls back to the profile if empty.",
      },
    },
    {
      name: "postedAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        position: "sidebar",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Still for this post. Prefer this over a remote URL so the image stays on SIFE hosting.",
      },
    },
    {
      name: "remoteUrl",
      type: "text",
      admin: {
        description: "Optional CDN URL from Instagram. Ignored when an image is uploaded.",
      },
    },
    {
      name: "sort",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Higher numbers appear first. Then newest posted date.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "published",
      options: [
        { label: "Published", value: "published" },
        { label: "Hidden", value: "hidden" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
