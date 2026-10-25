"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type UnlockFormProps = {
  slug: string;
  accessHint: string | null;
  forgotCodeHref: string;
  unlocked: boolean;
};

export function UnlockForm({ slug, accessHint, forgotCodeHref, unlocked }: UnlockFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onUnlock(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/academy/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, code }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (data?.error === "rate_limited") {
          setError("Too many tries — wait a few minutes, then try again.");
        } else if (data?.error === "invalid") {
          setError("That code doesn’t match. Check your welcome email, or ask us to resend.");
        } else {
          setError("Couldn’t unlock this course. Try again or use Forgot code.");
        }
        return;
      }
      setCode("");
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setPending(false);
    }
  }

  async function onLock() {
    setPending(true);
    setError(null);
    try {
      await fetch("/api/academy/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (unlocked) {
    return (
      <div className="border border-sife-lime/40 bg-sife-navy px-5 py-6 text-sife-white sm:px-7">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
          Course unlocked
        </p>
        <p className="mt-2 text-sm leading-relaxed text-sife-white/80">
          Modules with a course code are open on this device for about 90 days. Sequential modules
          open as you work through them.
        </p>
        <button
          type="button"
          onClick={onLock}
          disabled={pending}
          className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-sife-coral"
        >
          {pending ? "Locking…" : "Lock course on this device"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onUnlock}
      className="sife-form border border-sife-ink/15 bg-sife-cream px-5 py-6 text-sife-ink sm:px-7"
    >
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
          Unlock modules
        </p>
        <p className="mt-2 text-sm leading-relaxed text-sife-ink/75">
          Enter the access code from your welcome email. Public teasers stay open; full module
          bodies unlock after the code matches.
        </p>
        {accessHint ? (
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-sife-navy">
            Hint: {accessHint}
          </p>
        ) : null}
      </div>

      <label className="sife-field">
        <span>Access code</span>
        <input
          name="code"
          type="text"
          autoComplete="off"
          spellCheck={false}
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="SIFE-…"
          className="font-mono uppercase tracking-[0.08em]"
        />
      </label>

      {error ? <p className="text-sm text-sife-coral">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-coral" disabled={pending || !code.trim()}>
          {pending ? "Checking…" : "Unlock course"}
        </button>
        <a
          href={forgotCodeHref}
          className="text-xs font-bold uppercase tracking-[0.16em] text-sife-navy"
        >
          Forgot code? →
        </a>
      </div>
    </form>
  );
}
