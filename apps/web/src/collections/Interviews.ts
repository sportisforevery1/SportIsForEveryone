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

export const Interviews: CollectionConfig = {
  slug: "interviews",
  labels: {
    singular: "Field Interview",
    plural: "Field Interviews",
  },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "guest", "location", "featured", "updatedAt"],
    description: "Long-form field interviews. Empty on launch until editors publish.",
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
              name: "guest",
              type: "text",
            },
            {
              name: "person",
              type: "relationship",
              relationTo: "people",
              admin: {
                description: "Optional link to a person record for the guest.",
              },
            },
            {
              name: "excerpt",
              type: "textarea",
            },
            {
              name: "location",
              type: "text",
            },
            {
              name: "cover",
              type: "upload",
              relationTo: "media",
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
