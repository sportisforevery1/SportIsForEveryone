import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AddToCart } from "@/components/shop/AddToCart";
import { ShopImage } from "@/components/shop/ShopImage";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Link } from "@/i18n/navigation";
import { formatEur, getProductBySlug, getPublishedProducts, productStock } from "@/lib/shop";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products = await getPublishedProducts();
    return products.map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Shop" };
  return {
    title: `${product.code} ${product.title} | Sport is for Everyone`,
    description: product.description || `${product.code} ${product.title}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, t] = await Promise.all([getProductBySlug(slug), getTranslations("shop")]);
  if (!product) notFound();
  const soldOut = productStock(product) === 0;

  return (
    <article className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 md:px-12 md:py-24">
      <div>
        {product.image ? (
          <ShopImage
            src={product.image.src}
            alt={product.image.alt}
            width={product.image.width}
            height={product.image.height}
            className="w-full object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        ) : null}
      </div>
      <div>
        <Link href="/shop" className="text-xs uppercase tracking-[0.16em] text-sife-lime">
          {t("back")}
        </Link>
        <CategoryLabel>{product.code}</CategoryLabel>
        <h1 className="mt-4 text-4xl font-semibold uppercase leading-none md:text-6xl">{product.title}</h1>
        <p className="mt-4 text-lg text-sife-lime">{formatEur(product.price)}</p>
        {product.description ? <p className="mt-6 max-w-xl text-base leading-relaxed text-sife-white/75">{product.description}</p> : null}
        <div className="mt-8">{soldOut ? <p className="uppercase tracking-[0.16em] text-sife-white/50">{t("soldOut")}</p> : <AddToCart product={product} />}</div>
        <p className="mt-8 max-w-xl text-sm text-sife-white/55">{t("shipNote")}</p>
      </div>
    </article>
  );
}
