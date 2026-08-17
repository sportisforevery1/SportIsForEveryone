"use client";

import { useEffect, useRef } from "react";

import { MOTION_FLAGS } from "@/lib/motion/flags";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!MOTION_FLAGS.customCursor) return;

    const node = ref.current;
    if (!node) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion()) return;

    document.documentElement.classList.add("sife-cursor-on");

    const move = (event: PointerEvent) => {
      node.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    };

    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      document.documentElement.classList.remove("sife-cursor-on");
      window.removeEventListener("pointermove", move);
    };
  }, []);

  if (!MOTION_FLAGS.customCursor) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[200] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sife-lime mix-blend-difference lg:block"
      aria-hidden
    />
  );
}
