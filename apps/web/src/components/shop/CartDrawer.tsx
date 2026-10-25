"use client";

import { useTranslations } from "next-intl";

import { ShopImage } from "@/components/shop/ShopImage";
import { Link } from "@/i18n/navigation";
import { formatEur, cartTotal } from "@/lib/shop-model";
import { useCart } from "@/lib/shop-cart";

export function CartDrawer() {
  const t = useTranslations("shop");
  const { lines, open, setOpen, setQuantity, remove } = useCart();
  const total = cartTotal(lines);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" className="absolute inset-0 bg-black/70" aria-label={t("closeBag")} onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-sife-lime/20 bg-sife-black p-6 text-sife-white">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">{t("bag")}</p>
          <button type="button" className="text-xs uppercase tracking-[0.16em] text-sife-lime" onClick={() => setOpen(false)}>
            {t("closeBag")}
          </button>
        </div>
        {lines.length === 0 ? (
          <p className="text-sm text-sife-white/70">{t("empty")}</p>
        ) : (
          <ul className="flex-1 space-y-5 overflow-y-auto">
            {lines.map((line) => (
              <li key={`${line.productId}-${line.size}`} className="flex gap-3">
                {line.image ? (
                  <ShopImage src={line.image.src} alt={line.image.alt} width={72} height={72} sizes="80px" className="h-20 w-20 object-cover" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sife-lime">{line.code}</p>
                  <p className="truncate uppercase">{line.title}</p>
                  <p className="text-xs text-sife-white/60">
                    {line.size} · {formatEur(line.unitPrice)}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(event) => setQuantity(line.productId, line.size, Number(event.target.value))}
                      className="w-16 border border-sife-lime/30 bg-transparent px-2 py-1 text-sm"
                    />
                    <button type="button" className="text-xs uppercase tracking-[0.14em] text-sife-coral" onClick={() => remove(line.productId, line.size)}>
                      {t("remove")}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 border-t border-sife-lime/20 pt-4">
          <p className="mb-4 flex justify-between text-sm uppercase tracking-[0.14em]">
            <span>{t("total")}</span>
            <span>{formatEur(total)}</span>
          </p>
          <Link href="/shop/checkout" className="btn-coral w-full" onClick={() => setOpen(false)}>
            {t("checkout")}
          </Link>
          <Link href="/shop/cart" className="mt-3 block text-center text-xs uppercase tracking-[0.16em] text-sife-lime" onClick={() => setOpen(false)}>
            {t("viewBag")}
          </Link>
        </div>
      </aside>
    </div>
  );
}
