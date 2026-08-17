import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "Settings",
    useAsTitle: "email",
    defaultColumns: ["email", "updatedAt"],
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
