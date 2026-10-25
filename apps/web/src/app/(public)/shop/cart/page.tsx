"use client";

import { useTranslations } from "next-intl";

import { ShopImage } from "@/components/shop/ShopImage";
import { Link } from "@/i18n/navigation";
import { cartTotal, formatEur } from "@/lib/shop-model";
import { useCart } from "@/lib/shop-cart";

export default function CartPage() {
  const t = useTranslations("shop");
  const { lines, setQuantity, remove } = useCart();

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-12 md:py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-sife-lime">{t("label")}</p>
      <h1 className="mt-3 text-4xl font-semibold uppercase md:text-6xl">{t("bag")}</h1>
      {lines.length === 0 ? (
        <p className="mt-8 text-sife-white/70">
          {t("empty")}{" "}
          <Link href="/shop" className="text-sife-lime">
            {t("continue")}
          </Link>
        </p>
      ) : (
        <>
          <ul className="mt-10 space-y-6">
            {lines.map((line) => (
              <li key={`${line.productId}-${line.size}`} className="flex gap-4 border-b border-sife-lime/15 pb-6">
                {line.image ? (
                  <ShopImage src={line.image.src} alt={line.image.alt} width={96} height={96} sizes="96px" className="h-24 w-24 object-cover" />
                ) : null}
                <div className="flex-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-sife-lime">{line.code}</p>
                  <Link href={`/shop/${line.slug}`} className="text-xl uppercase">
                    {line.title}
                  </Link>
                  <p className="text-sm text-sife-white/60">
                    {line.size} · {formatEur(line.unitPrice)}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(event) => setQuantity(line.productId, line.size, Number(event.target.value))}
                      className="w-16 border border-sife-lime/30 bg-transparent px-2 py-1"
                    />
                    <button type="button" className="text-xs uppercase tracking-[0.14em] text-sife-coral" onClick={() => remove(line.productId, line.size)}>
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 flex justify-between text-sm uppercase tracking-[0.16em]">
            <span>{t("total")}</span>
            <span>{formatEur(cartTotal(lines))}</span>
          </p>
          <Link href="/shop/checkout" className="btn-coral mt-6 inline-flex">
            {t("checkout")}
          </Link>
        </>
      )}
    </section>
  );
}
