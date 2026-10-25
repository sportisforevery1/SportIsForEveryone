import type { Access, FieldAccess } from "payload";

type RoleUser = { id?: string | number; role?: string | null } | null | undefined;

export function isSuperAdmin(user: RoleUser | object | null | undefined): boolean {
  if (!user || typeof user !== "object") return false;
  return "role" in user && (user as { role?: string | null }).role === "super-admin";
}

export function isEditor(user: RoleUser | object | null | undefined): boolean {
  if (!user || typeof user !== "object") return false;
  return "role" in user && (user as { role?: string | null }).role === "editor";
}

export function isLearner(user: RoleUser | object | null | undefined): boolean {
  if (!user || typeof user !== "object") return false;
  return "role" in user && (user as { role?: string | null }).role === "learner";
}

/** Can open Payload admin UI. */
export function canAccessAdmin(user: RoleUser | object | null | undefined): boolean {
  return isSuperAdmin(user) || isEditor(user);
}

export const superAdmin: Access = ({ req }) => isSuperAdmin(req?.user);

export const superAdminField: FieldAccess = ({ req }) => isSuperAdmin(req?.user);

export const selfOrSuperAdmin: Access = ({ req }) => {
  const user = req?.user;
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return { id: { equals: user.id } };
};
