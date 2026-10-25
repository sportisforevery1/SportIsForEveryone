"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { loginAction, signupAction, type AuthFormState } from "@/lib/auth/actions";

type Mode = "login" | "signup";

const initial: AuthFormState = null;

export function AuthForm({ mode, next = "/account" }: { mode: Mode; next?: string }) {
  const t = useTranslations("account");
  const action = mode === "signup" ? signupAction : loginAction;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="mt-8 flex max-w-md flex-col gap-5">
      <input type="hidden" name="next" value={next} />
      {mode === "signup" ? (
        <label className="sife-field text-sife-ink">
          {t("name")}
          <input name="name" type="text" autoComplete="name" className="mt-0" />
        </label>
      ) : null}
      <label className="sife-field text-sife-ink">
        {t("email")}
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="sife-field text-sife-ink">
        {t("password")}
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </label>
      {state?.error ? (
        <p className="text-sm text-sife-coral" role="alert">
          {t(state.error)}
        </p>
      ) : null}
      <button type="submit" className="btn-coral w-fit" disabled={pending}>
        {pending ? t("working") : mode === "signup" ? t("signup") : t("login")}
      </button>
    </form>
  );
}
