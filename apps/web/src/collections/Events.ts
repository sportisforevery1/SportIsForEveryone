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

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "startDate", "timing", "eventType", "location", "updatedAt"],
    description:
      "Dated gatherings — talks, hikes, runs, open sessions, camps. Optional Zoom/Meet join link. “Also list on Academy” is opt-in only.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultSort: "-startDate",
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
              name: "cover",
              type: "upload",
              relationTo: "media",
            },
            {
              type: "row",
              fields: [
                {
                  name: "startDate",
                  type: "date",
                  required: true,
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "dayAndTime" },
                  },
                },
                {
                  name: "endDate",
                  type: "date",
                  admin: {
                    width: "50%",
                    date: { pickerAppearance: "dayAndTime" },
                  },
                },
              ],
            },
            {
              name: "location",
              type: "text",
            },
            {
              name: "eventType",
              type: "select",
              defaultValue: "other",
              options: [
                { label: "Talk", value: "talk" },
                { label: "Hike", value: "hike" },
                { label: "Run", value: "run" },
                { label: "Open session", value: "open-session" },
                { label: "Camp", value: "camp" },
                { label: "Other", value: "other" },
              ],
              admin: {
                description: "Camps and open sessions are Events — not a separate nav item.",
              },
            },
            {
              name: "joinUrl",
              type: "text",
              admin: {
                description:
                  "Zoom, Google Meet, or any call link. Learners open it in a new tab — no embedded video.",
              },
            },
            {
              name: "timing",
              type: "select",
              required: true,
              defaultValue: "upcoming",
              options: [
                { label: "Upcoming", value: "upcoming" },
                { label: "Past", value: "past" },
              ],
              admin: {
                description: "Shown on the events index. Independent of draft/publish.",
              },
            },
            {
              name: "showOnAcademy",
              type: "checkbox",
              label: "Also list on Academy",
              defaultValue: false,
              admin: {
                description:
                  "Off by default. She chooses which gatherings appear under Academy — most events stay on the Events calendar only.",
              },
            },
            {
              name: "relatedCourse",
              type: "relationship",
              relationTo: "courses",
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.showOnAcademy),
                description:
                  "Optional. When set, this gathering also appears on that course’s Academy page.",
              },
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
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data._status === "published" && !data.publishedAt) {
          data.publishedAt = originalDoc?.publishedAt ?? new Date().toISOString();
        }

        if (!data.timing && (data.endDate || data.startDate)) {
          const end = data.endDate || data.startDate;
          data.timing = new Date(end) < new Date() ? "past" : "upcoming";
        }

        return data;
      },
    ],
  },
  versions: editorialVersions,
};
