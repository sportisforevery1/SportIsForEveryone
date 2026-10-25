"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { clearAuthCookie, getSessionUser, setAuthCookie } from "@/lib/auth/session";
import { getCms } from "@/lib/cms";
import { linkEnrolmentsForEmail } from "@/lib/academy/enrolment";
import { withLocale } from "@/i18n/path";

export type AuthFormState = { error?: string } | null;

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = await getLocale();
  const name = read(formData, "name");
  const email = read(formData, "email").toLowerCase();
  const password = read(formData, "password");
  const next = read(formData, "next") || "/account";

  if (!email || !password || password.length < 8) {
    return { error: "errorRequired" };
  }
  if (!email.includes("@")) return { error: "errorEmail" };

  const payload = await getCms();
  try {
    // Public signup cannot set staff roles — Users hooks also force learner.
    await payload.create({
      collection: "users",
      overrideAccess: true,
      context: { publicSignup: true },
      data: {
        email,
        password,
        name: name || undefined,
        role: "learner",
      },
    });
  } catch {
    return { error: "errorExists" };
  }

  const login = await payload.login({
    collection: "users",
    data: { email, password },
  });
  if (!login.token) return { error: "errorLogin" };
  await setAuthCookie(login.token, login.exp);
  await linkEnrolmentsForEmail(email, login.user.id);

  redirect(withLocale(next.startsWith("/") ? next : "/account", locale));
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = await getLocale();
  const email = read(formData, "email").toLowerCase();
  const password = read(formData, "password");
  const nextRaw = read(formData, "next");

  if (!email || !password) return { error: "errorRequired" };

  const payload = await getCms();
  let role: string | undefined;
  try {
    const login = await payload.login({
      collection: "users",
      data: { email, password },
    });
    if (!login.token) return { error: "errorLogin" };
    await setAuthCookie(login.token, login.exp);
    role = login.user?.role;
    if (role === "learner") {
      await linkEnrolmentsForEmail(email, login.user.id);
    }
  } catch {
    return { error: "errorLogin" };
  }

  // Staff → CMS. Learners → account (or ?next=).
  const isStaff = role === "super-admin" || role === "editor";
  const next =
    nextRaw.startsWith("/") && nextRaw !== "/account"
      ? nextRaw
      : isStaff
        ? "/admin"
        : "/account";

  redirect(withLocale(next, locale));
}

export async function logoutAction(): Promise<void> {
  const locale = await getLocale();
  await clearAuthCookie();
  redirect(withLocale("/", locale));
}

export async function ensureLoggedIn(nextPath = "/account"): Promise<void> {
  const locale = await getLocale();
  const user = await getSessionUser();
  if (!user) {
    redirect(withLocale(`/login?next=${encodeURIComponent(nextPath)}`, locale));
  }
}
