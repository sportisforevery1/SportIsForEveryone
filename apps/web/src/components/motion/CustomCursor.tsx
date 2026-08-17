"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const pointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const sync = () => {
      const on = pointer.matches && !prefersReducedMotion();
      node.style.display = on ? "block" : "none";
      document.documentElement.classList.toggle("sife-cursor-on", on);
    };

    sync();
    pointer.addEventListener("change", sync);

    const move = (event: PointerEvent) => {
      node.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      document.documentElement.classList.remove("sife-cursor-on");
      pointer.removeEventListener("change", sync);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[200] hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sife-lime mix-blend-difference"
      aria-hidden
    />
  );
}
