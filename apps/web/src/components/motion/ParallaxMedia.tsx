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
  priority?: boolean;
  /** CSS object-position — portraits need a high focus so faces aren't cropped out on desktop. */
  objectPosition?: string;
};

export function ParallaxMedia({
  src,
  alt,
  width,
  height,
  className,
  priority,
  objectPosition = "50% 50%",
}: ParallaxMediaProps) {
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
        { yPercent: -6 },
        {
          yPercent: 6,
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
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        sizes="100vw"
        quality={priority ? 72 : 75}
        style={{ objectPosition }}
        className="h-full w-full scale-105 object-cover"
      />
    </div>
  );
}
