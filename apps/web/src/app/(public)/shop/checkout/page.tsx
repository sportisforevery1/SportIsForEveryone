import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default async function CheckoutPage() {
  const t = await getTranslations("shop");

  return (
    <section className="sife-section mx-auto max-w-3xl px-5 md:px-12">
      <CategoryLabel>{t("label")}</CategoryLabel>
      <h1 className="sife-display mt-3 text-sife-white">{t("checkout")}</h1>
      <p className="mt-4 max-w-xl text-sife-white/75">{t("checkoutIntro")}</p>
      <div className="mt-10 border-t border-sife-cream/15 pt-8">
        <CheckoutForm />
      </div>
    </section>
  );
}
