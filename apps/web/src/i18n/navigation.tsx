"use client";

import NextLink from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";

import { withLocale } from "@/i18n/path";

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ href, ...props }: LinkProps) {
  const locale = useLocale();
  const nextHref = typeof href === "string" ? withLocale(href, locale) : href;

  return <NextLink href={nextHref} {...props} />;
}
