import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";
import { authenticatedOrApprovedProject } from "../access/authenticatedOrPublished";
import { featuredField } from "../fields/editorial";
import { seoTab } from "../fields/seo";
import { slugField } from "../fields/slug";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: {
    singular: "Project",
    plural: "Database projects",
  },
  admin: {
    group: "Network",
    useAsTitle: "name",
    defaultColumns: ["name", "city", "country", "status", "updatedAt"],
    description:
      "Grassroots directory entries. Join-the-database submissions arrive as pending until approved.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrApprovedProject,
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
              type: "row",
              fields: [
                {
                  name: "city",
                  type: "text",
                  admin: { width: "33%" },
                },
                {
                  name: "country",
                  type: "text",
                  admin: { width: "33%" },
                },
                {
                  name: "region",
                  type: "text",
                  admin: { width: "34%" },
                },
              ],
            },
            {
              name: "tags",
              type: "relationship",
              relationTo: "tags",
              hasMany: true,
            },
            {
              type: "row",
              fields: [
                {
                  name: "instagram",
                  type: "text",
                  admin: { width: "50%" },
                },
                {
                  name: "website",
                  type: "text",
                  admin: { width: "50%" },
                },
              ],
            },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
            },
            {
              name: "description",
              type: "textarea",
            },
          ],
        },
        seoTab,
      ],
    },
    slugField("name"),
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      index: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Published", value: "published" },
        { label: "Rejected", value: "rejected" },
      ],
      admin: {
        position: "sidebar",
        description: "Only published projects appear on the public database.",
      },
    },
    featuredField,
  ],
};
