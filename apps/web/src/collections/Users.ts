import type { CollectionConfig } from "payload";

import { isSuperAdmin, selfOrSuperAdmin, superAdmin } from "../access/roles";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "Settings",
    useAsTitle: "email",
    defaultColumns: ["email", "role", "updatedAt"],
    description: "Account access. Super admins can invite and remove users; editors only see themselves.",
  },
  auth: true,
  access: {
    admin: ({ req }) => Boolean(req?.user),
    create: async ({ req }) => {
      if (isSuperAdmin(req.user)) return true;
      if (req.user) return false;
      const existing = await req.payload.find({
        collection: "users",
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      return existing.totalDocs === 0;
    },
    delete: superAdmin,
    read: selfOrSuperAdmin,
    update: selfOrSuperAdmin,
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== "create" || !data) return data;
        const existing = await req.payload.find({
          collection: "users",
          limit: 1,
          depth: 0,
          overrideAccess: true,
        });
        if (existing.totalDocs === 0) {
          data.role = "super-admin";
        } else if (req.user && !isSuperAdmin(req.user)) {
          data.role = "editor";
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const target = await req.payload.findByID({
          collection: "users",
          id,
          depth: 0,
          overrideAccess: true,
        });
        if (target.role !== "super-admin") return;
        const supers = await req.payload.find({
          collection: "users",
          where: { role: { equals: "super-admin" } },
          limit: 2,
          depth: 0,
          overrideAccess: true,
        });
        if (supers.totalDocs <= 1) {
          throw new Error("Cannot delete the last super-admin.");
        }
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      saveToJWT: true,
      options: [
        { label: "Super admin", value: "super-admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        create: ({ req }) => !req?.user || isSuperAdmin(req.user),
        update: ({ req }) => !req?.user || isSuperAdmin(req.user),
      },
      admin: {
        description: "Super admins can invite and remove other users. Editors can edit content only.",
      },
    },
  ],
};
