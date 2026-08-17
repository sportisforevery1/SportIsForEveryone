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
    defaultColumns: ["title", "startDate", "timing", "location", "updatedAt"],
    description: "Upcoming gatherings and past hikes, screenings, and sessions.",
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
