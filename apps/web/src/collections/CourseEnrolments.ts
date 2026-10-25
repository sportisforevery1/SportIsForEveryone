import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";

export const CourseEnrolments: CollectionConfig = {
  slug: "course-enrolments",
  admin: {
    group: "Academy",
    useAsTitle: "email",
    defaultColumns: ["email", "course", "status", "updatedAt"],
    description: "Who was invited or unlocked for a course — audit trail for Oumou / admins.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      index: true,
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
      name: "notes",
      type: "textarea",
    },
  ],
};
