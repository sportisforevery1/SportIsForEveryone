"use client";

import type { ReactNode } from "react";

import { CustomCursor } from "@/components/motion/CustomCursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      {children}
    </>
  );
}
