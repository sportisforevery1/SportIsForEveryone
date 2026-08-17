"use client";

import { useActionState } from "react";

import { submitInquiry, type InquiryState } from "@/lib/inquiry";

type InquiryFormProps = {
  type: "contact" | "work-with-us";
  next: "/about" | "/work-with-us";
  submitLabel: string;
};

export function InquiryForm({ type, next, submitLabel }: InquiryFormProps) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, null);

  return (
    <form action={action} className="sife-form mt-8 max-w-2xl">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="next" value={next} />
      <p className="sife-honeypot" aria-hidden>
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="sife-field">
        <span>Name</span>
        <input name="name" type="text" required autoComplete="name" />
      </label>
      <label className="sife-field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="sife-field">
        <span>Organisation</span>
        <input name="organization" type="text" autoComplete="organization" />
      </label>
      <label className="sife-field">
        <span>Message</span>
        <textarea name="message" rows={6} required />
      </label>
      {state?.error ? <p className="text-sm text-sife-coral">{state.error}</p> : null}
      <button type="submit" className="btn-coral mt-4" disabled={pending}>
        {pending ? "Sending" : submitLabel}
      </button>
    </form>
  );
}
