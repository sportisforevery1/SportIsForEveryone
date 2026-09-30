import type { CollectionConfig, Condition, UnnamedTab } from "payload";

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

const onPage =
  (...slugs: string[]): Condition =>
  (data) =>
    slugs.includes(data?.slug);

// Structured blocks for the redesigned About and Work with us pages.
// Empty fields fall back to the copy in lib/site.ts.
const sectionsTab: UnnamedTab = {
  label: "Sections",
  description: "Only used on About and Work with us. Leave a field empty to keep the current site copy.",
  fields: [
    {
      name: "statement",
      type: "textarea",
      admin: {
        condition: onPage("about", "work-with-us"),
        description: "About: the large statement. Work with us: the intro beside the heading.",
      },
    },
    {
      name: "lead",
      type: "textarea",
      admin: {
        condition: onPage("about"),
        description: "Paragraph under the statement.",
      },
    },
    {
      name: "founder",
      type: "group",
      admin: { condition: onPage("about") },
      fields: [
        { name: "name", type: "text" },
        { name: "image", type: "upload", relationTo: "media" },
        {
          name: "bio",
          type: "textarea",
          admin: { description: "Separate paragraphs with a blank line." },
        },
        {
          name: "stats",
          type: "array",
          maxRows: 2,
          fields: [
            { name: "value", type: "text", required: true, admin: { description: "e.g. 37%" } },
            { name: "text", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "services",
      type: "array",
      maxRows: 3,
      admin: {
        condition: onPage("work-with-us"),
        description: "Photo cards. Each links to a past project.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea", required: true },
        { name: "project", type: "text", admin: { description: "Past project name" } },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "steps",
      type: "array",
      maxRows: 4,
      admin: {
        condition: onPage("work-with-us"),
        description: "The numbered “How we work” band.",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea", required: true },
      ],
    },
  ],
};

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description: "Singleton-style pages such as About, Work with us, and Impressum.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
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
              name: "hero",
              type: "group",
              fields: [
                {
                  name: "heading",
                  type: "text",
                },
                {
                  name: "subheading",
                  type: "textarea",
                },
                {
                  name: "media",
                  type: "upload",
                  relationTo: "media",
                },
              ],
            },
            {
              name: "body",
              type: "richText",
            },
            {
              name: "gallery",
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
          ],
        },
        sectionsTab,
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
