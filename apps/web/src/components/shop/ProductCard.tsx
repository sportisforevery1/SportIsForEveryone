import { getTranslations } from "next-intl/server";

import { AddToCart } from "@/components/shop/AddToCart";
import { ShopImage } from "@/components/shop/ShopImage";
import { Link } from "@/i18n/navigation";
import { formatEur, productStock, type ShopProduct } from "@/lib/shop-model";

export async function ProductCard({ product, priority = false }: { product: ShopProduct; priority?: boolean }) {
  const t = await getTranslations("shop");
  const soldOut = productStock(product) === 0;

  return (
    <article className="group flex flex-col gap-4">
      <Link href={`/shop/${product.slug}`} className="relative block overflow-hidden bg-sife-navy/20">
        {product.image ? (
          <ShopImage
            src={product.image.src}
            alt={product.image.alt}
            width={product.image.width}
            height={product.image.height}
            priority={priority}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="aspect-[4/3] bg-sife-navy" />
        )}
        {soldOut ? (
          <span className="absolute left-3 top-3 bg-sife-coral px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white">
            {t("soldOut")}
          </span>
        ) : null}
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-sife-lime">{product.code}</p>
          <h2 className="mt-1 text-xl font-semibold uppercase tracking-tight">
            <Link href={`/shop/${product.slug}`}>{product.title}</Link>
          </h2>
        </div>
        <p className="text-sm text-sife-white/80">{formatEur(product.price)}</p>
      </div>
      <AddToCart product={product} />
    </article>
  );
}
