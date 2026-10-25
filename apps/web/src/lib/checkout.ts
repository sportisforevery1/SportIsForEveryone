"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getSessionUser } from "@/lib/auth/session";
import { getCms } from "@/lib/cms";
import { withLocale } from "@/i18n/path";

export type CheckoutState = { error: "errorRequired" | "errorEmail" | "errorStock" | "errorCart" } | null;

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

type PostedItem = {
  productId: string;
  size: string;
  quantity: number;
};

function parseItems(raw: string): PostedItem[] {
  try {
    const parsed = JSON.parse(raw) as PostedItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.productId && item.size && item.quantity > 0);
  } catch {
    return [];
  }
}

export async function submitOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const locale = await getLocale();
  if (read(formData, "company")) {
    redirect(withLocale("/shop/thanks", locale));
  }

  const name = read(formData, "name");
  const email = read(formData, "email");
  const phone = read(formData, "phone");
  const address = read(formData, "address");
  const city = read(formData, "city");
  const postalCode = read(formData, "postalCode");
  const country = read(formData, "country") || "Germany";
  const notes = read(formData, "notes");
  const items = parseItems(read(formData, "items"));

  if (!name || !email || !address || !city || !postalCode || items.length === 0) {
    return { error: items.length === 0 ? "errorCart" : "errorRequired" };
  }
  if (!email.includes("@")) return { error: "errorEmail" };

  const productIds = [
    ...new Set(items.map((item) => (Number.isFinite(Number(item.productId)) ? Number(item.productId) : item.productId))),
  ];
  const payload = await getCms();
  const found = await payload.find({
    collection: "products",
    where: { id: { in: productIds } },
    limit: productIds.length,
    depth: 0,
    overrideAccess: true,
  });
  const products = new Map(found.docs.map((doc) => [String(doc.id), doc]));

  const lineItems: Array<{
    product: number;
    code: string;
    title: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }> = [];

  for (const item of items) {
    const product = products.get(String(item.productId));
    if (!product || product.status !== "published") return { error: "errorStock" };
    const variant = (product.variants || []).find((entry) => entry.label === item.size);
    if (!variant || Number(variant.stock || 0) < item.quantity) return { error: "errorStock" };
    lineItems.push({
      product: Number(product.id),
      code: product.code,
      title: product.title,
      size: item.size,
      quantity: item.quantity,
      unitPrice: Number(product.price || 0),
    });
  }

  const user = await getSessionUser();

  const order = await payload.create({
    collection: "orders",
    overrideAccess: true,
    data: {
      user: user?.id,
      name,
      email,
      phone: phone || undefined,
      address,
      city,
      postalCode,
      country,
      notes: notes || undefined,
      items: lineItems,
      paymentStatus: "unpaid",
      fulfillmentStatus: "unfulfilled",
      inventoryAdjusted: true,
    },
  });

  console.info(`Shop order ${order.orderNumber}: ${name} <${email}>`);
  redirect(`${withLocale("/shop/thanks", locale)}?order=${encodeURIComponent(String(order.orderNumber || ""))}`);
}
