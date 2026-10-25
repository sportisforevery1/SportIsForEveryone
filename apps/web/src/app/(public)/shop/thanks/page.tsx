import { getTranslations } from "next-intl/server";

import { ClearCart } from "@/components/shop/ClearCart";
import { Link } from "@/i18n/navigation";

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const [{ order }, t] = await Promise.all([searchParams, getTranslations("shop")]);

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 md:px-12 md:py-24">
      <ClearCart />
      <p className="text-xs uppercase tracking-[0.18em] text-sife-lime">{t("label")}</p>
      <h1 className="mt-3 text-4xl font-semibold uppercase md:text-6xl">{t("thanksTitle")}</h1>
      {order ? (
        <p className="mt-6 text-lg text-sife-lime">
          {t("orderNumber")}: {order}
        </p>
      ) : null}
      <p className="mt-4 max-w-xl text-sife-white/75">{t("thanksBody")}</p>
      <Link href="/shop" className="btn-coral mt-8 inline-flex">
        {t("continue")}
      </Link>
    </section>
  );
}
