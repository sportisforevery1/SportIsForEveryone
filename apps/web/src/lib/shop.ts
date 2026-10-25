import { cmsCache } from "@/lib/cms-cache";
import { getCms } from "@/lib/cms";
import { mediaSrc } from "@/lib/media";
import type { Media } from "@/payload-types";
import { type ShopProduct, type ShopVariant } from "@/lib/shop-model";

export type { CartLine, ShopProduct, ShopVariant } from "@/lib/shop-model";
export { availableSizes, cartTotal, formatEur, productStock } from "@/lib/shop-model";

function mapProduct(doc: {
  id: number | string;
  code?: string | null;
  title?: string | null;
  slug?: string | null;
  category?: string | null;
  price?: number | null;
  description?: string | null;
  image?: number | Media | null;
  variants?: Array<{ id?: string | null; label?: string | null; sku?: string | null; stock?: number | null }> | null;
  featured?: boolean | null;
}): ShopProduct | null {
  if (!doc.code || !doc.title || !doc.slug || !doc.category) return null;
  const fallbackImage = `/seed/shop/${doc.slug}.jpg`;
  const cmsImage = mediaSrc(doc.image);
  const image =
    process.env.NODE_ENV === "development" && cmsImage?.src.startsWith("/api/media/file/")
      ? null
      : cmsImage;
  return {
    id: doc.id,
    code: doc.code,
    title: doc.title,
    slug: doc.slug,
    category: doc.category as ShopProduct["category"],
    price: Number(doc.price || 0),
    description: doc.description || null,
    image: image ?? {
      src: fallbackImage,
      alt: `${doc.title} from Sport is for Everyone`,
      width: 1200,
      height: 1200,
    },
    variants: (doc.variants || [])
      .filter((variant): variant is { id?: string | null; label: string; sku: string; stock?: number | null } =>
        Boolean(variant.label && variant.sku),
      )
      .map(
        (variant): ShopVariant => ({
          id: variant.id,
          label: variant.label,
          sku: variant.sku,
          stock: Number(variant.stock || 0),
        }),
      ),
    featured: Boolean(doc.featured),
  };
}

async function loadPublishedProducts(): Promise<ShopProduct[]> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "products",
    where: { status: { equals: "published" } },
    limit: 100,
    depth: 1,
    sort: "code",
    overrideAccess: true,
  });
  return result.docs.map(mapProduct).filter((item): item is ShopProduct => Boolean(item));
}

export function getPublishedProducts(): Promise<ShopProduct[]> {
  return cmsCache(["shop-products", "v2"], loadPublishedProducts);
}

export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  const products = await getPublishedProducts();
  return products.find((product) => product.slug === slug) || null;
}
