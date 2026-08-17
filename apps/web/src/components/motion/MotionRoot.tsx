"use client";

import type { ReactNode } from "react";

import { CustomCursor } from "@/components/motion/CustomCursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { MOTION_FLAGS } from "@/lib/motion/flags";

export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      {MOTION_FLAGS.customCursor ? <CustomCursor /> : null}
      {children}
    </>
  );
}
