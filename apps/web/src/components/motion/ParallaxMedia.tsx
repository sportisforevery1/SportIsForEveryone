"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { registerScroll } from "@/lib/motion/register";
import { prefersReducedMotion } from "@/lib/motion/reducedMotion";

type ParallaxMediaProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export function ParallaxMedia({ src, alt, width, height, className }: ParallaxMediaProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image || prefersReducedMotion()) return;

    const { gsap } = registerScroll();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        image,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, frame);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={frameRef} className={`overflow-hidden ${className ?? ""}`.trim()}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full scale-110 object-cover"
      />
    </div>
  );
}
