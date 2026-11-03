import type { CollectionConfig, Condition, UnnamedTab } from "payload";
import { revalidateTag } from "next/cache";

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

const programStatusOptions = [
  { label: "In development", value: "building" },
  { label: "Waitlist", value: "waitlist" },
  { label: "Open / enrol", value: "open" },
] as const;

const programFields = [
  { name: "title", type: "text" as const, required: true },
  {
    name: "status",
    type: "select" as const,
    defaultValue: "building",
    options: [...programStatusOptions],
  },
  {
    name: "statusLabel",
    type: "text" as const,
    admin: { description: "Optional override (e.g. “Enrolment opens March”)." },
  },
  { name: "summary", type: "textarea" as const, required: true },
  {
    name: "points",
    type: "array" as const,
    labels: { singular: "Bullet", plural: "Bullets" },
    fields: [{ name: "text", type: "text" as const, required: true }],
  },
];

// Structured blocks for About, Work with us, and Academy.
// Empty fields fall back to defaults in lib/*.
const sectionsTab: UnnamedTab = {
  label: "Sections",
  description:
    "About, Work with us, and Academy. Leave a field empty to keep the fallback site copy.",
  fields: [
    {
      name: "statement",
      type: "textarea",
      admin: {
        condition: onPage("about", "work-with-us", "academy"),
        description:
          "About: large statement. Work with us: intro. Academy: short intro under the hero.",
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
    {
      name: "academyFeatured",
      type: "group",
      label: "Featured course",
      admin: {
        condition: onPage("academy"),
        description: "Consistency Academy (or whichever program should lead the page).",
      },
      fields: [
        ...programFields,
        {
          name: "format",
          type: "text",
          defaultValue: "Course + info",
          admin: { description: "Shown in the fact row (e.g. “8-week cohort”)." },
        },
        {
          name: "hostedBy",
          type: "text",
          defaultValue: "Sport is for Everyone",
        },
        {
          name: "ctaLabel",
          type: "text",
          defaultValue: "Inquire",
          admin: { description: "Button label (Inquire / Join waitlist / Enrol)." },
        },
        {
          name: "courseBody",
          type: "richText",
          admin: {
            description:
              "Full course info: syllabus, dates, who it’s for, pricing — edit anytime.",
          },
        },
      ],
    },
    {
      name: "academyPrograms",
      type: "array",
      label: "Future programs",
      labels: { singular: "Program", plural: "Programs" },
      maxRows: 8,
      admin: {
        condition: onPage("academy"),
        description: "Programs in development. Add a row when a new course is ready to announce.",
      },
      fields: programFields,
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
  hooks: {
    ...stampPublishedAt,
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag("page", { expire: 0 });
          if (typeof doc?.slug === "string" && doc.slug) {
            revalidateTag(doc.slug, { expire: 0 });
          }
        } catch (error) {
          console.error("pages afterChange revalidate failed", error);
        }
      },
    ],
  },
  versions: editorialVersions,
};
