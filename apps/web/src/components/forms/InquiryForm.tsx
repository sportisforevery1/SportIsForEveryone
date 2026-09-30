"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { submitInquiry, type InquiryState } from "@/lib/inquiry";

type InquiryFormProps = {
  type: "contact" | "work-with-us";
  next: "/about" | "/work-with-us";
};

export function InquiryForm({ type, next }: InquiryFormProps) {
  const t = useTranslations("forms");
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, null);

  return (
    <form action={action} className="sife-form max-w-2xl">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="next" value={next} />
      <p className="sife-honeypot" aria-hidden>
        <label>
          {t("company")}
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="grid gap-[1.1rem] sm:grid-cols-2">
        <label className="sife-field">
          <span>{t("name")}</span>
          <input name="name" type="text" required autoComplete="name" />
        </label>
        <label className="sife-field">
          <span>{t("email")}</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <label className="sife-field">
        <span>{t("organisation")}</span>
        <input name="organization" type="text" autoComplete="organization" />
      </label>
      <label className="sife-field">
        <span>{t("message")}</span>
        <textarea name="message" rows={6} required />
      </label>
      {state?.error ? <p className="text-sm text-sife-coral">{t(state.error)}</p> : null}
      <button type="submit" className="btn-coral justify-self-start" disabled={pending}>
        {pending ? t("sending") : t("send")}
      </button>
    </form>
  );
}
