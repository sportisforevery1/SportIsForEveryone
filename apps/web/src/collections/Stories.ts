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

export const Stories: CollectionConfig = {
  slug: "stories",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "series", "featured", "updatedAt"],
    description: "Stories across borders, Where She Stands, and education pieces.",
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
                  name: "category",
                  type: "select",
                  required: true,
                  defaultValue: "borders",
                  options: [
                    { label: "Stories across borders", value: "borders" },
                    { label: "Where She Stands", value: "where-she-stands" },
                    { label: "Education", value: "education" },
                  ],
                  admin: { width: "50%" },
                },
                {
                  name: "series",
                  type: "select",
                  options: [
                    { label: "Vol. 01 Dakar", value: "dakar" },
                    { label: "Vol. 02 Iten", value: "iten" },
                  ],
                  admin: { width: "50%" },
                },
              ],
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
