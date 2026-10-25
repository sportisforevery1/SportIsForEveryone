import type { Access, FieldAccess } from "payload";

type RoleUser = { role?: string | null } | null | undefined;

export function isSuperAdmin(user: RoleUser | object | null | undefined): boolean {
  if (!user || typeof user !== "object") return false;
  return "role" in user && (user as { role?: string | null }).role === "super-admin";
}

export const superAdmin: Access = ({ req }) => isSuperAdmin(req?.user);

export const superAdminField: FieldAccess = ({ req }) => isSuperAdmin(req?.user);

export const selfOrSuperAdmin: Access = ({ req }) => {
  const user = req?.user;
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return { id: { equals: user.id } };
};
