import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { ClearCart } from "@/components/shop/ClearCart";
import { Link } from "@/i18n/navigation";

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const [{ order }, t] = await Promise.all([searchParams, getTranslations("shop")]);

  return (
    <section className="sife-section mx-auto max-w-3xl px-5 md:px-12">
      <ClearCart />
      <CategoryLabel>{t("label")}</CategoryLabel>
      <h1 className="sife-display mt-3 text-sife-white">{t("thanksTitle")}</h1>
      <div className="mt-8 border border-sife-cream/15 bg-sife-cream px-5 py-8 text-sife-ink">
        {order ? (
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sife-coral">
            {t("orderNumber")}: {order}
          </p>
        ) : null}
        <p className="mt-4 max-w-xl text-base leading-relaxed text-sife-ink/80">{t("thanksBody")}</p>
        <Link href="/shop" className="btn-coral mt-8 inline-flex">
          {t("continue")}
        </Link>
      </div>
    </section>
  );
}
