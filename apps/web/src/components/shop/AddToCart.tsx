"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { useCart } from "@/lib/shop-cart";
import { availableSizes, type ShopProduct } from "@/lib/shop-model";

export function AddToCart({ product }: { product: ShopProduct }) {
  const t = useTranslations("shop");
  const { add } = useCart();
  const sizes = useMemo(() => availableSizes(product), [product]);
  const [size, setSize] = useState(sizes[0]?.label || "");

  if (sizes.length === 0) {
    return <p className="text-sm uppercase tracking-[0.16em] text-sife-white/50">{t("soldOut")}</p>;
  }

  return (
    <form
      className="flex flex-wrap items-center gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        add({
          productId: product.id,
          slug: product.slug,
          code: product.code,
          title: product.title,
          size,
          unitPrice: product.price,
          image: product.image,
        });
      }}
    >
      {sizes.length > 1 ? (
        <label className="text-xs uppercase tracking-[0.16em] text-sife-white/70">
          <span className="sr-only">{t("size")}</span>
          <select
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="border border-sife-lime/30 bg-sife-black px-3 py-2 text-sife-white"
          >
            {sizes.map((variant) => (
              <option key={variant.sku} value={variant.label}>
                {variant.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <button type="submit" className="btn-coral">
        {t("add")}
      </button>
    </form>
  );
}
