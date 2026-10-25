import type { CollectionConfig } from "payload";

import { canAccessAdmin } from "../access/roles";

export const CourseProgress: CollectionConfig = {
  slug: "course-progress",
  admin: {
    group: "Academy",
    useAsTitle: "moduleSlug",
    defaultColumns: ["user", "course", "moduleSlug", "openedAt"],
    description: "Modules a learner has opened (sequential unlock source of truth).",
  },
  access: {
    create: ({ req }) => canAccessAdmin(req?.user),
    delete: ({ req }) => canAccessAdmin(req?.user),
    read: ({ req }) => canAccessAdmin(req?.user),
    update: ({ req }) => canAccessAdmin(req?.user),
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
    },
    {
      name: "moduleSlug",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "openedAt",
      type: "date",
      required: true,
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "completedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
  ],
};
