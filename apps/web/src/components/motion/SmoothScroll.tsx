"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { registerScroll } from "@/lib/motion/register";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Native scroll on phones — Lenis steals touch and makes section/gallery motion feel dead.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const { gsap, ScrollTrigger } = registerScroll();
    const lenis = new Lenis({ autoRaf: false });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return null;
}
