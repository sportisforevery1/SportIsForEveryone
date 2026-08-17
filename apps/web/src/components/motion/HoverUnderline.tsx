import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type HoverUnderlineProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function HoverUnderline({ href, children, className }: HoverUnderlineProps) {
  return (
    <Link href={href} className={`sife-hover-underline ${className ?? ""}`.trim()}>
      {children}
    </Link>
  );
}
