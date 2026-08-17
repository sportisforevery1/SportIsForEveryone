"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { joinDatabase, type JoinState } from "@/lib/join";
import type { DirectoryTag } from "@/lib/directory-query";

export function JoinForm({ tags }: { tags: DirectoryTag[] }) {
  const t = useTranslations("forms");
  const [state, action, pending] = useActionState<JoinState, FormData>(joinDatabase, null);

  return (
    <form action={action} className="sife-form mt-10 max-w-2xl">
      <p className="sife-honeypot" aria-hidden>
        <label>
          {t("company")}
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="sife-field">
        <span>{t("name")}</span>
        <input name="name" type="text" required autoComplete="name" />
      </label>
      <label className="sife-field">
        <span>{t("email")}</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="sife-field">
        <span>{t("organisation")}</span>
        <input name="organization" type="text" autoComplete="organization" />
      </label>
      <label className="sife-field">
        <span>{t("project")}</span>
        <input name="projectName" type="text" required />
      </label>
      <label className="sife-field">
        <span>{t("location")}</span>
        <input name="location" type="text" placeholder={t("locationPlaceholder")} />
      </label>
      <label className="sife-field">
        <span>{t("links")}</span>
        <textarea name="links" rows={3} placeholder={t("linksPlaceholder")} />
      </label>
      <label className="sife-field">
        <span>{t("description")}</span>
        <textarea name="message" rows={5} />
      </label>
      <fieldset className="sife-field">
        <legend>{t("tags")}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.slug} className="sife-chip-option">
              <input type="checkbox" name="tag" value={tag.slug} />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {state?.error ? <p className="text-sm text-sife-coral">{t(state.error)}</p> : null}
      <button type="submit" className="btn-coral mt-4" disabled={pending}>
        {pending ? t("sending") : t("join")}
      </button>
    </form>
  );
}
