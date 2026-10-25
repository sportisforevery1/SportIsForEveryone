import { getTranslations } from "next-intl/server";

import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function CheckoutPage() {
  const t = await getTranslations("shop");

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-12 md:py-24">
      <p className="text-xs uppercase tracking-[0.18em] text-sife-lime">{t("label")}</p>
      <h1 className="mt-3 text-4xl font-semibold uppercase md:text-6xl">{t("checkout")}</h1>
      <p className="mt-4 max-w-xl text-sife-white/75">{t("checkoutIntro")}</p>
      <CheckoutForm />
    </section>
  );
}
