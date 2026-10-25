"use client";

import { useTranslations } from "next-intl";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { ShopImage } from "@/components/shop/ShopImage";
import { Link } from "@/i18n/navigation";
import { cartTotal, formatEur } from "@/lib/shop-model";
import { useCart } from "@/lib/shop-cart";

export default function CartPage() {
  const t = useTranslations("shop");
  const { lines, setQuantity, remove } = useCart();

  return (
    <section className="sife-section mx-auto max-w-3xl px-5 md:px-12">
      <CategoryLabel>{t("label")}</CategoryLabel>
      <h1 className="sife-display mt-3 text-sife-white">{t("bag")}</h1>
      {lines.length === 0 ? (
        <div className="mt-10 border-t border-sife-cream/15 pt-8">
          <p className="text-sife-white/70">
            {t("empty")}{" "}
            <Link href="/shop" className="text-sife-lime">
              {t("continue")}
            </Link>
          </p>
        </div>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-sife-cream/15 border-t border-sife-cream/15">
            {lines.map((line) => (
              <li key={`${line.productId}-${line.size}`} className="flex gap-4 py-6">
                {line.image ? (
                  <ShopImage
                    src={line.image.src}
                    alt={line.image.alt}
                    width={96}
                    height={96}
                    sizes="96px"
                    className="h-24 w-24 object-cover"
                  />
                ) : null}
                <div className="flex-1">
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-sife-lime">
                    {line.code}
                  </p>
                  <Link href={`/shop/${line.slug}`} className="text-xl uppercase">
                    {line.title}
                  </Link>
                  <p className="text-sm text-sife-white/60">
                    {line.size} · {formatEur(line.unitPrice)}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <label className="sr-only" htmlFor={`qty-${line.productId}-${line.size}`}>
                      Quantity
                    </label>
                    <input
                      id={`qty-${line.productId}-${line.size}`}
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(event) =>
                        setQuantity(line.productId, line.size, Number(event.target.value))
                      }
                      className="w-20 border border-sife-cream/30 bg-transparent px-2 py-1.5 text-sife-cream outline-none focus:border-sife-lime"
                    />
                    <button
                      type="button"
                      className="text-xs uppercase tracking-[0.14em] text-sife-coral"
                      onClick={() => remove(line.productId, line.size)}
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 border border-sife-cream/15 bg-sife-cream px-5 py-6 text-sife-ink">
            <p className="flex justify-between text-sm uppercase tracking-[0.16em]">
              <span>{t("total")}</span>
              <span>{formatEur(cartTotal(lines))}</span>
            </p>
            <Link href="/shop/checkout" className="btn-coral mt-5 inline-flex">
              {t("checkout")}
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
