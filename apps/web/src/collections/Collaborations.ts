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

export const Collaborations: CollectionConfig = {
  slug: "collaborations",
  admin: {
    group: "Network",
    useAsTitle: "title",
    defaultColumns: ["title", "featured", "updatedAt"],
    description: "Partnerships such as Oumou x Roots.",
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
              name: "summary",
              type: "textarea",
            },
            {
              name: "url",
              type: "text",
              label: "External URL",
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "partners",
              type: "relationship",
              relationTo: "people",
              hasMany: true,
            },
            {
              name: "body",
              type: "richText",
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
