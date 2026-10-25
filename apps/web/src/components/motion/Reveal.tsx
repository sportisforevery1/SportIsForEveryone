"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { registerScroll } from "@/lib/motion/register";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Above-the-fold content — visible immediately, no scroll wait. */
  eager?: boolean;
};

export function Reveal({ children, className, eager = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (eager || prefersReducedMotion()) {
      el.classList.add("sife-reveal-visible");
      return;
    }

    const { gsap, ScrollTrigger } = registerScroll();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 94%",
            once: true,
            toggleActions: "play none none none",
          },
          onStart: () => {
            el.classList.add("sife-reveal-visible");
          },
          onComplete: () => {
            el.classList.add("sife-reveal-visible");
          },
        },
      );
      // Play immediately when already in the viewport on first paint.
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === el && trigger.isActive) {
          trigger.animation?.progress(1);
          el.classList.add("sife-reveal-visible");
        }
      });
      ScrollTrigger.refresh();
    }, el);

    const fallback = window.setTimeout(() => {
      el.classList.add("sife-reveal-visible");
      gsap.set(el, { opacity: 1, y: 0 });
    }, 600);

    return () => {
      window.clearTimeout(fallback);
      ctx.revert();
    };
  }, [eager]);

  return (
    <div
      ref={ref}
      className={`sife-reveal ${eager ? "sife-reveal-eager sife-reveal-visible" : ""} ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}
