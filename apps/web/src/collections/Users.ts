import type { CollectionConfig } from "payload";

import {
  canAccessAdmin,
  isSuperAdmin,
  selfOrSuperAdmin,
  superAdmin,
} from "../access/roles";

const ROLES = ["super-admin", "editor", "learner"] as const;
type Role = (typeof ROLES)[number];

function asRole(value: unknown): Role | null {
  if (typeof value !== "string") return null;
  return (ROLES as readonly string[]).includes(value) ? (value as Role) : null;
}

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: "Settings",
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role", "updatedAt"],
    description:
      "One user table for everyone. Super admins assign roles. Public signup is always Learner. Shop checkout and database join do not require an account.",
  },
  auth: true,
  access: {
    /** Only editor + super-admin open /admin (learners redirected). */
    admin: ({ req }) => canAccessAdmin(req?.user),
    create: async ({ req }) => {
      // Super admins create staff/learners in the CMS.
      if (isSuperAdmin(req.user)) return true;
      // Editors never create users.
      if (req.user) return false;
      // Allow Payload’s empty-DB first-user screen only. Public signup uses
      // overrideAccess + hooks that force role=learner.
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
      async ({ data, operation, req, context }) => {
        if (!data) return data;

        // Seed / ops scripts may pass context.allowElevatedRole.
        if (context?.allowElevatedRole) {
          const role = asRole(data.role);
          if (role) data.role = role;
          return data;
        }

        if (operation === "create") {
          // /signup — always regular learner, even on an empty database.
          if (context?.publicSignup) {
            data.role = "learner";
            return data;
          }
          if (!req.user) {
            // Unauthenticated create: learner, unless this is the empty-DB
            // Payload first-user screen (only when no users exist yet).
            const existing = await req.payload.find({
              collection: "users",
              limit: 1,
              depth: 0,
              overrideAccess: true,
            });
            data.role = existing.totalDocs === 0 ? "super-admin" : "learner";
            return data;
          }
          if (!isSuperAdmin(req.user)) {
            data.role = "learner";
            return data;
          }
          // Super admin in CMS: keep chosen role (default learner if missing).
          data.role = asRole(data.role) || "learner";
          return data;
        }

        // Updates: only super-admin may change role.
        if (operation === "update" && data.role != null && !isSuperAdmin(req.user)) {
          delete data.role;
        }
        return data;
      },
    ],
    beforeChange: [
      async ({ data, operation, originalDoc, req, context }) => {
        if (!data || context?.allowElevatedRole) return data;

        if (operation === "update" && data.role && originalDoc?.role === "super-admin") {
          const next = asRole(data.role);
          if (next && next !== "super-admin") {
            const supers = await req.payload.find({
              collection: "users",
              where: { role: { equals: "super-admin" } },
              limit: 2,
              depth: 0,
              overrideAccess: true,
            });
            if (supers.totalDocs <= 1) {
              throw new Error("Cannot demote the last super-admin.");
            }
          }
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
      defaultValue: "learner",
      saveToJWT: true,
      options: [
        {
          label: "Super admin",
          value: "super-admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
        {
          label: "Learner (regular)",
          value: "learner",
        },
      ],
      access: {
        // Role is only settable by super-admins in the CMS (never via public signup).
        create: ({ req }) => isSuperAdmin(req?.user),
        update: ({ req }) => isSuperAdmin(req?.user),
      },
      admin: {
        description:
          "Super admin: Users + full CMS. Editor: content only (no Users). Learner: public account (Academy/orders) — no /admin. Shop + database join work as guests without an account.",
      },
    },
  ],
};
