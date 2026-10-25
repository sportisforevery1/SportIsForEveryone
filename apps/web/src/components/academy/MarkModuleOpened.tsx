"use client";

import { useEffect } from "react";

type Props = {
  courseSlug: string;
  moduleSlug: string;
  enabled: boolean;
};

/** Records sequential progress via API (cookies cannot be set during RSC render). */
export function MarkModuleOpened({ courseSlug, moduleSlug, enabled }: Props) {
  useEffect(() => {
    if (!enabled) return;
    void fetch("/api/academy/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: courseSlug, moduleSlug }),
    });
  }, [courseSlug, moduleSlug, enabled]);

  return null;
}
