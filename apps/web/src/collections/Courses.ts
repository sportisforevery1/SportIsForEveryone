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

export const Courses: CollectionConfig = {
  slug: "courses",
  admin: {
    group: "Academy",
    useAsTitle: "title",
    defaultColumns: ["title", "programStatus", "featured", "updatedAt"],
    description:
      "Academy programs (e.g. Consistency Academy). Access codes unlock module bodies for learners — never shown on the public site.",
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
            { name: "title", type: "text", required: true },
            {
              name: "summary",
              type: "textarea",
              required: true,
              admin: { description: "Short pitch on Academy index and course landing." },
            },
            {
              name: "programStatus",
              type: "select",
              required: true,
              defaultValue: "building",
              admin: {
                description:
                  "Public program state (separate from draft/publish). Open = enrolment / unlock active.",
              },
              options: [
                { label: "In development", value: "building" },
                { label: "Waitlist", value: "waitlist" },
                { label: "Open / enrol", value: "open" },
                { label: "Archived", value: "archived" },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "format",
                  type: "text",
                  defaultValue: "Course + info",
                  admin: { width: "50%", description: "e.g. 4-week cohort" },
                },
                {
                  name: "hostedBy",
                  type: "text",
                  defaultValue: "Sport is for Everyone",
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
              name: "infoBody",
              type: "richText",
              admin: {
                description: "Public course overview — who it’s for, what’s included (safe to show locked).",
              },
            },
            {
              name: "ctaLabel",
              type: "text",
              defaultValue: "Inquire",
            },
          ],
        },
        {
          label: "Access",
          fields: [
            {
              name: "accessCode",
              type: "text",
              admin: {
                description:
                  "You invent this (e.g. SIFE-CONSIST or a per-cohort phrase). Stored only in the CMS/DB — never shown on the public site. Share it by email/WhatsApp with learners. Rotate anytime; old cookies stay valid until they expire (~90 days) unless you ask learners to re-enter.",
              },
            },
            {
              name: "accessHint",
              type: "text",
              defaultValue: "Code from your welcome email",
              admin: {
                description:
                  'Shown on the unlock form. If someone forgets their code, they use “Forgot code?” → mailto you; look it up here or under Course enrolments and resend.',
              },
            },
          ],
        },
        {
          label: "Modules",
          fields: [
            {
              name: "modules",
              type: "array",
              labels: { singular: "Module", plural: "Modules" },
              admin: {
                description: "Ordered lessons. Unlock mode controls when the body is visible.",
              },
              fields: [
                { name: "title", type: "text", required: true },
                {
                  name: "slug",
                  type: "text",
                  required: true,
                  admin: {
                    description: "URL segment under the course (e.g. arrive).",
                  },
                },
                {
                  name: "teaser",
                  type: "textarea",
                  required: true,
                  admin: { description: "Always visible — one or two sentences." },
                },
                {
                  name: "unlockMode",
                  type: "select",
                  required: true,
                  defaultValue: "with_course",
                  options: [
                    { label: "Always open (public)", value: "always" },
                    { label: "Needs course unlock code", value: "with_course" },
                    { label: "Sequential (after previous module)", value: "sequential" },
                  ],
                },
                {
                  name: "estimatedMinutes",
                  type: "number",
                  admin: { description: "Optional reading / practice time." },
                },
                {
                  name: "videos",
                  type: "array",
                  labels: { singular: "Video", plural: "Videos" },
                  admin: {
                    description:
                      "Lesson player (left). Paste YouTube / Vimeo / Loom / mp4. First URL is the main player with controls. Learners can widen Video or Split from the toolbar.",
                  },
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      admin: { description: 'Shown under the player (e.g. "Week 1 welcome").' },
                    },
                    {
                      name: "url",
                      type: "text",
                      required: true,
                      admin: {
                        description: "Watch/share link or direct .mp4 — not a raw upload here.",
                      },
                    },
                  ],
                },
                {
                  name: "images",
                  type: "array",
                  labels: { singular: "Image", plural: "Images" },
                  admin: {
                    description:
                      "Stills / worksheets. Shown in notes; learners tap “Open wide” to view them in the main player area (same space as video).",
                  },
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
                      admin: { description: "Optional label under the still." },
                    },
                  ],
                },
                {
                  name: "body",
                  type: "richText",
                  admin: {
                    description:
                      "Chapter notes (right panel). Keep scannable — headings + short lists work best beside video.",
                  },
                },
              ],
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
