"use client";

import { useTranslations } from "next-intl";

import { useCart } from "@/lib/shop-cart";

export function CartButton() {
  const t = useTranslations("shop");
  const { count, setOpen } = useCart();

  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-sife-lime text-sife-lime"
      onClick={() => setOpen(true)}
      aria-label={t("bag")}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-sife-coral px-1 text-[0.6rem] font-bold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}
