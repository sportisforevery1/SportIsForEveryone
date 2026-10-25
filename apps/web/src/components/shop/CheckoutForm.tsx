"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { submitOrder, type CheckoutState } from "@/lib/checkout";
import { cartTotal, formatEur } from "@/lib/shop-model";
import { useCart } from "@/lib/shop-cart";

export function CheckoutForm() {
  const t = useTranslations("shop");
  const tForms = useTranslations("forms");
  const router = useRouter();
  const { lines } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(submitOrder, null);

  useEffect(() => {
    if (lines.length === 0) router.replace("/shop");
  }, [lines.length, router]);

  return (
    <form action={action} className="sife-form mt-8 max-w-2xl">
      <input type="hidden" name="items" value={JSON.stringify(lines.map((line) => ({ productId: line.productId, size: line.size, quantity: line.quantity })))} />
      <p className="sife-honeypot" aria-hidden>
        <label>
          {tForms("company")}
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="sife-field">
        <span>{tForms("name")}</span>
        <input name="name" type="text" required autoComplete="name" />
      </label>
      <label className="sife-field">
        <span>{tForms("email")}</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="sife-field">
        <span>{t("phone")}</span>
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label className="sife-field">
        <span>{t("address")}</span>
        <input name="address" type="text" required autoComplete="street-address" />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="sife-field">
          <span>{t("city")}</span>
          <input name="city" type="text" required autoComplete="address-level2" />
        </label>
        <label className="sife-field">
          <span>{t("postalCode")}</span>
          <input name="postalCode" type="text" required autoComplete="postal-code" />
        </label>
        <label className="sife-field">
          <span>{t("country")}</span>
          <input name="country" type="text" required defaultValue="Germany" autoComplete="country-name" />
        </label>
      </div>
      <label className="sife-field">
        <span>{t("notes")}</span>
        <textarea name="notes" rows={4} />
      </label>
      <p className="text-sm uppercase tracking-[0.14em] text-sife-lime">
        {t("total")}: {formatEur(cartTotal(lines))}
      </p>
      {state?.error ? <p className="text-sm text-sife-coral">{t(state.error)}</p> : null}
      <button type="submit" className="btn-coral mt-4" disabled={pending || lines.length === 0}>
        {pending ? t("placing") : t("placeOrder")}
      </button>
    </form>
  );
}
