"use client";

import { useEffect, useState } from "react";

import { InstagramGallery3D } from "@/components/home/InstagramGallery3D";
import { InstagramViewfinder } from "@/components/home/InstagramViewfinder";
import type { InstagramPost } from "@/lib/instagram";

export type InstagramThemeId = "viewfinder" | "depth";

const STORAGE_KEY = "sife-ig-theme";

const THEMES: { id: InstagramThemeId; label: string }[] = [
  { id: "viewfinder", label: "Viewfinder" },
  { id: "depth", label: "Depth" },
];

function readStoredTheme(): InstagramThemeId {
  if (typeof window === "undefined") return "viewfinder";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "viewfinder" || stored === "depth") return stored;
  const fromQuery = new URLSearchParams(window.location.search).get("ig");
  if (fromQuery === "viewfinder" || fromQuery === "depth") return fromQuery;
  return "viewfinder";
}

export function InstagramThemes({
  posts,
  compareLabel,
}: {
  posts: InstagramPost[];
  compareLabel: string;
}) {
  const [theme, setTheme] = useState<InstagramThemeId>("viewfinder");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(readStoredTheme());
    setReady(true);
  }, []);

  const select = (id: InstagramThemeId) => {
    setTheme(id);
    window.localStorage.setItem(STORAGE_KEY, id);
    const url = new URL(window.location.href);
    url.searchParams.set("ig", id);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 md:px-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sife-ink/45">
          {compareLabel}
        </p>
        <div
          className="inline-flex max-w-full flex-wrap rounded-full border border-sife-ink/15 bg-sife-white/70 p-0.5"
          role="tablist"
          aria-label={compareLabel}
        >
          {THEMES.map((item) => {
            const active = theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => select(item.id)}
                className={
                  "rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition " +
                  (active
                    ? "bg-sife-navy text-sife-white"
                    : "text-sife-ink/60 hover:text-sife-ink")
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {!ready || theme === "viewfinder" ? (
        <InstagramViewfinder posts={posts} />
      ) : (
        <InstagramGallery3D posts={posts} />
      )}
    </div>
  );
}
