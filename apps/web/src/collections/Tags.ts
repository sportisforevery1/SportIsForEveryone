import type { CollectionConfig } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";
import { slugField } from "../fields/slug";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    group: "Network",
    useAsTitle: "name",
    defaultColumns: ["name", "group", "updatedAt"],
    description: "Shared vocabulary for the grassroots database and films.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: "name",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    slugField("name"),
    {
      name: "group",
      type: "select",
      required: true,
      defaultValue: "community",
      options: [
        { label: "Community", value: "community" },
        { label: "Access", value: "access" },
        { label: "Focus", value: "focus" },
      ],
    },
  ],
};
