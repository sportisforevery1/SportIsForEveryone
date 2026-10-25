import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Submissions: CollectionConfig = {
  slug: "submissions",
  labels: {
    singular: "Contact message",
    plural: "Contact messages",
  },
  admin: {
    group: "Inbox",
    useAsTitle: "name",
    defaultColumns: ["type", "name", "email", "status", "createdAt"],
    description:
      "Messages from About → Contact us, Work with us, and Join the database. They also appear on the dashboard.",
  },
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  defaultSort: "-createdAt",
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "contact",
      options: [
        { label: "Contact", value: "contact" },
        { label: "Work with us", value: "work-with-us" },
        { label: "Join the database", value: "join-database" },
      ],
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "organization",
      type: "text",
    },
    {
      name: "projectName",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData?.type === "join-database",
      },
    },
    {
      name: "location",
      type: "text",
    },
    {
      name: "links",
      type: "textarea",
    },
    {
      name: "message",
      type: "textarea",
      label: "Message / description",
    },
    {
      name: "requestedTags",
      type: "text",
      admin: {
        description: "Comma-separated tags from the public form, before an editor maps them.",
        condition: (_, siblingData) => siblingData?.type === "join-database",
      },
    },
    {
      name: "relatedProject",
      type: "relationship",
      relationTo: "projects",
      admin: {
        description: "Filled after an editor turns a join request into a pending project.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Reviewed", value: "reviewed" },
        { label: "Archived", value: "archived" },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
};
