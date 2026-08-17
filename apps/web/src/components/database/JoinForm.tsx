"use client";

import { useActionState } from "react";

import { joinDatabase, type JoinState } from "@/lib/join";
import type { DirectoryTag } from "@/lib/directory-query";

export function JoinForm({ tags }: { tags: DirectoryTag[] }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinDatabase, null);

  return (
    <form action={action} className="sife-form mt-10 max-w-2xl">
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
        <span>Project</span>
        <input name="projectName" type="text" required />
      </label>
      <label className="sife-field">
        <span>Location</span>
        <input name="location" type="text" placeholder="City, country" />
      </label>
      <label className="sife-field">
        <span>Links</span>
        <textarea name="links" rows={3} placeholder="Instagram or website" />
      </label>
      <label className="sife-field">
        <span>Description</span>
        <textarea name="message" rows={5} />
      </label>
      <fieldset className="sife-field">
        <legend>Tags</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.slug} className="sife-chip-option">
              <input type="checkbox" name="tag" value={tag.slug} />
              <span>{tag.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {state?.error ? <p className="text-sm text-sife-coral">{state.error}</p> : null}
      <button type="submit" className="btn-coral mt-4" disabled={pending}>
        {pending ? "Sending" : "Join the database"}
      </button>
    </form>
  );
}
