"use client";

import { useEffect } from "react";

import type { HomeSurface } from "@/lib/surfaces";

/** Sets surface on <html>. Default = Bolting Blue; `?surface=black` = cinematic preview. */
export function SurfaceRoot({ surface }: { surface: HomeSurface }) {
  useEffect(() => {
    if (surface === "black") {
      document.documentElement.dataset.sifeSurface = "black";
    } else {
      delete document.documentElement.dataset.sifeSurface;
    }
    return () => {
      delete document.documentElement.dataset.sifeSurface;
    };
  }, [surface]);

  return null;
}
