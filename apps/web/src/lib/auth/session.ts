import { cookies, headers } from "next/headers";

import { getCms } from "@/lib/cms";
import type { User } from "@/payload-types";

const TOKEN_COOKIE = "payload-token";

export type SessionUser = User;

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const payload = await getCms();
    const h = new Headers(await headers());
    // Payload CSRF rules reject cookie JWTs when Origin/Sec-Fetch-Site are missing
    // (common for RSC + server-side fetch). Prefer Authorization: JWT from the cookie.
    if (!h.get("authorization")) {
      const jar = await cookies();
      const token = jar.get(TOKEN_COOKIE)?.value;
      if (token) h.set("Authorization", `JWT ${token}`);
    }
    const { user } = await payload.auth({ headers: h });
    return (user as SessionUser | null) ?? null;
  } catch {
    return null;
  }
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("unauthorized");
  return user;
}

export async function setAuthCookie(token: string, exp?: number): Promise<void> {
  const jar = await cookies();
  jar.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: exp ? new Date(exp * 1000) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });
}

export async function clearAuthCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
}
