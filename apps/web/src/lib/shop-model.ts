import type { MediaRef } from "@/lib/media";

export type ShopVariant = {
  id?: string | null;
  label: string;
  sku: string;
  stock: number;
};

export type ShopProduct = {
  id: number | string;
  code: string;
  title: string;
  slug: string;
  category: "apparel" | "accessory" | "print";
  price: number;
  description: string | null;
  image: MediaRef | null;
  variants: ShopVariant[];
  featured: boolean;
};

export type CartLine = {
  productId: number | string;
  slug: string;
  code: string;
  title: string;
  size: string;
  unitPrice: number;
  quantity: number;
  image: MediaRef | null;
};

export function formatEur(value: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

export function productStock(product: ShopProduct): number {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
}

export function availableSizes(product: ShopProduct): ShopVariant[] {
  return product.variants.filter((variant) => variant.stock > 0);
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}
