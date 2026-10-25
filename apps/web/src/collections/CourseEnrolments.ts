import type { CollectionConfig } from "payload";

import { canAccessAdmin } from "../access/roles";

export const CourseEnrolments: CollectionConfig = {
  slug: "course-enrolments",
  admin: {
    group: "Academy",
    useAsTitle: "email",
    defaultColumns: ["email", "course", "status", "user", "updatedAt"],
    description: "Who was invited or unlocked for a course — audit trail for Oumou / admins.",
  },
  access: {
    create: ({ req }) => canAccessAdmin(req?.user),
    delete: ({ req }) => canAccessAdmin(req?.user),
    read: ({ req }) => canAccessAdmin(req?.user),
    update: ({ req }) => canAccessAdmin(req?.user),
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (!data) return data;
        const nextStatus = data.status ?? originalDoc?.status;
        const prevStatus = originalDoc?.status;
        if (nextStatus === "active" && prevStatus !== "active" && !data.enrolledAt) {
          data.enrolledAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      index: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: { description: "Linked when the learner signs up or unlocks while logged in." },
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
    },
    {
      name: "accessCode",
      type: "text",
      admin: { description: "Code issued to this person (may match the course default)." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "invited",
      options: [
        { label: "Invited", value: "invited" },
        { label: "Active", value: "active" },
        { label: "Revoked", value: "revoked" },
      ],
    },
    {
      name: "source",
      type: "select",
      defaultValue: "admin",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Access code", value: "code" },
        { label: "Request", value: "request" },
      ],
    },
    {
      name: "enrolledAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime" } },
    },
    {
      name: "notes",
      type: "textarea",
    },
  ],
};
