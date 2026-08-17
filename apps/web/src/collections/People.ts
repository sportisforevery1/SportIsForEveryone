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

export const People: CollectionConfig = {
  slug: "people",
  admin: {
    group: "Network",
    useAsTitle: "name",
    defaultColumns: ["name", "role", "location", "updatedAt"],
    description: "Founder, collaborators, and film credits as structured records.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultSort: "name",
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
            },
            {
              name: "role",
              type: "text",
            },
            {
              name: "location",
              type: "text",
            },
            {
              name: "portrait",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "bio",
              type: "richText",
            },
          ],
        },
        seoTab,
      ],
    },
    slugField("name"),
    featuredField,
    publishedAtField,
  ],
  hooks: stampPublishedAt,
  versions: editorialVersions,
};
