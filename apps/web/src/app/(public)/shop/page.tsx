import { getTranslations } from "next-intl/server";

import { ProductCard } from "@/components/shop/ProductCard";
import { PageHero } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getPublishedProducts } from "@/lib/shop";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shop | Sport is for Everyone",
    description: "Running Fist edition merch. Independent, not tax-deductible.",
  };
}

export default async function ShopPage() {
  const [products, t] = await Promise.all([getPublishedProducts(), getTranslations("shop")]);

  return (
    <>
      <div className="overflow-hidden border-b border-sife-true-black/10 bg-sife-lime py-2 text-sife-true-black">
        <p className="animate-[sife-marquee_22s_linear_infinite] whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em]">
          {`${t("marquee")} · `.repeat(8)}
        </p>
      </div>
      <PageHero label={t("label")} heading={t("heading")} subheading={t("subheading")} />
      <section className="px-5 pb-20 md:px-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={String(product.id)} product={product} priority={index < 2} />
          ))}
        </div>
        {products.length === 0 ? <p className="text-sife-white/70">{t("emptyCatalog")}</p> : null}
      </section>
      <section className="bg-sife-cream px-5 py-16 text-sife-black md:px-12">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.18em] text-sife-navy">{t("aboutLabel")}</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold uppercase leading-tight md:text-5xl">{t("aboutTitle")}</h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-sife-black/80">{t("aboutBody")}</p>
          <p className="mt-4 max-w-2xl text-sm text-sife-black/70">{t("taxNote")}</p>
        </Reveal>
      </section>
    </>
  );
}
