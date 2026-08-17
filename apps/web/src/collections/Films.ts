import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";
import { authenticatedOrPublished } from "../access/authenticatedOrPublished";
import {
  editorialVersions,
  featuredField,
  publishedAtField,
  stampPublishedAt,
} from "../fields/editorial";
import { seoTab } from "../fields/seo";
import { slugField } from "../fields/slug";

export const Films: CollectionConfig = {
  slug: "films",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "location", "year", "featured", "updatedAt"],
    description: "The screening-room archive of SIFE films.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultSort: "-publishedAt",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "excerpt",
              type: "textarea",
            },
            {
              type: "row",
              fields: [
                {
                  name: "location",
                  type: "text",
                  admin: { width: "50%" },
                },
                {
                  name: "year",
                  type: "number",
                  admin: { width: "25%" },
                },
                {
                  name: "runtime",
                  type: "text",
                  admin: {
                    width: "25%",
                    description: "e.g. 1’28”",
                  },
                },
              ],
            },
            {
              name: "videoUrl",
              type: "text",
              label: "Video URL",
              admin: {
                description: "Vimeo, YouTube, or another embed URL. Do not upload raw film files.",
              },
            },
            {
              name: "poster",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "stills",
              type: "array",
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
                {
                  name: "caption",
                  type: "text",
                },
              ],
            },
            {
              name: "credits",
              type: "richText",
            },
            {
              name: "body",
              type: "richText",
            },
            {
              name: "series",
              type: "text",
              admin: {
                description: "Optional series label, if the film belongs to one.",
              },
            },
            {
              name: "tags",
              type: "relationship",
              relationTo: "tags",
              hasMany: true,
            },
          ],
        },
        seoTab,
      ],
    },
    slugField(),
    featuredField,
    publishedAtField,
  ],
  hooks: stampPublishedAt,
  versions: editorialVersions,
};
