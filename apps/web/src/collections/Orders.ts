import type { CollectionAfterChangeHook, CollectionBeforeValidateHook, CollectionConfig, Payload } from "payload";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

type Variant = { id?: string | null; label?: string; sku?: string; stock?: number };

const stampNumber: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== "create" || !data || data.orderNumber) return data;
  const existing = await req.payload.count({
    collection: "orders",
    overrideAccess: true,
  });
  data.orderNumber = `SIFE-${String(existing.totalDocs + 1001).padStart(4, "0")}`;
  return data;
};

const stampTotals: CollectionBeforeValidateHook = ({ data }) => {
  if (!data?.items || !Array.isArray(data.items)) return data;
  const subtotal = data.items.reduce((sum: number, item: { unitPrice?: number; quantity?: number }) => {
    return sum + Number(item.unitPrice || 0) * Number(item.quantity || 0);
  }, 0);
  data.subtotal = Math.round(subtotal * 100) / 100;
  data.total = data.subtotal;
  return data;
};

const stampDates: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  if (!data) return data;
  if (data.paymentStatus === "paid" && originalDoc?.paymentStatus !== "paid" && !data.paidAt) {
    data.paidAt = new Date().toISOString();
  }
  if (data.fulfillmentStatus === "shipped" && originalDoc?.fulfillmentStatus !== "shipped" && !data.shippedAt) {
    data.shippedAt = new Date().toISOString();
  }
  return data;
};

async function adjustStock(
  payload: Payload,
  items: Array<{ product?: number | string | { id?: number | string }; size?: string; quantity?: number }>,
  direction: 1 | -1,
) {
  const deltas = new Map<string, Map<string, number>>();
  for (const item of items) {
    const productId = typeof item.product === "object" ? item.product?.id : item.product;
    if (productId == null || !item.size || !item.quantity) continue;
    const key = String(productId);
    const sizes = deltas.get(key) ?? new Map<string, number>();
    sizes.set(item.size, (sizes.get(item.size) || 0) + Number(item.quantity));
    deltas.set(key, sizes);
  }

  const ids = [...deltas.keys()].map((id) => (Number.isFinite(Number(id)) ? Number(id) : id));
  if (ids.length === 0) return;

  const found = await payload.find({
    collection: "products",
    where: { id: { in: ids } },
    limit: ids.length,
    depth: 0,
    overrideAccess: true,
  });

  await Promise.all(
    found.docs.map(async (product) => {
      const sizes = deltas.get(String(product.id));
      if (!sizes) return;
      const variants = (Array.isArray(product.variants) ? product.variants : []).map((variant: Variant) => ({
        ...variant,
      }));
      for (const [size, quantity] of sizes) {
        const index = variants.findIndex((variant) => variant.label === size);
        if (index < 0) continue;
        variants[index] = {
          ...variants[index],
          stock: Math.max(0, Number(variants[index].stock || 0) + direction * quantity),
        };
      }
      await payload.update({
        collection: "products",
        id: product.id,
        overrideAccess: true,
        data: { variants },
      });
    }),
  );
}

const syncInventory: CollectionAfterChangeHook = async ({ doc, operation, previousDoc, req }) => {
  const items = Array.isArray(doc.items) ? doc.items : [];

  if (operation === "create") {
    await adjustStock(req.payload, items, -1);
    return;
  }

  const wasCancelled = previousDoc?.fulfillmentStatus === "cancelled";
  const isCancelled = doc.fulfillmentStatus === "cancelled";
  if (!wasCancelled && isCancelled && doc.inventoryAdjusted) {
    await adjustStock(req.payload, items, 1);
    await req.payload.update({
      collection: "orders",
      id: doc.id,
      overrideAccess: true,
      data: { inventoryAdjusted: false },
    });
  }
};

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: "Order",
    plural: "Orders",
  },
  admin: {
    group: "Shop",
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "email", "paymentStatus", "fulfillmentStatus", "total", "createdAt"],
    description: "Sales. Paid = bought. Shipped = sent. Cancelling restocks inventory.",
  },
  access: {
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  defaultSort: "-createdAt",
  hooks: {
    beforeValidate: [stampNumber, stampTotals, stampDates],
    afterChange: [syncInventory],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
        description: "Set when the buyer was logged in at checkout.",
      },
    },
    {
      name: "orderNumber",
      type: "text",
      unique: true,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      type: "row",
      fields: [
        {
          name: "paymentStatus",
          type: "select",
          required: true,
          defaultValue: "unpaid",
          options: [
            { label: "Unpaid", value: "unpaid" },
            { label: "Paid (bought)", value: "paid" },
            { label: "Refunded", value: "refunded" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "fulfillmentStatus",
          type: "select",
          required: true,
          defaultValue: "unfulfilled",
          options: [
            { label: "Unfulfilled", value: "unfulfilled" },
            { label: "Shipped", value: "shipped" },
            { label: "Cancelled", value: "cancelled" },
          ],
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        { name: "email", type: "email", required: true, admin: { width: "50%" } },
      ],
    },
    { name: "phone", type: "text" },
    { name: "address", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "city", type: "text", required: true, admin: { width: "40%" } },
        { name: "postalCode", type: "text", required: true, admin: { width: "30%" } },
        { name: "country", type: "text", required: true, defaultValue: "Germany", admin: { width: "30%" } },
      ],
    },
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
        },
        {
          type: "row",
          fields: [
            { name: "code", type: "text", admin: { width: "25%" } },
            { name: "title", type: "text", admin: { width: "35%" } },
            { name: "size", type: "text", admin: { width: "20%" } },
            { name: "quantity", type: "number", required: true, min: 1, admin: { width: "20%" } },
          ],
        },
        { name: "unitPrice", type: "number", required: true, min: 0 },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "subtotal", type: "number", admin: { readOnly: true, width: "50%" } },
        { name: "total", type: "number", admin: { readOnly: true, width: "50%" } },
      ],
    },
    { name: "tracking", type: "text" },
    { name: "notes", type: "textarea" },
    {
      type: "row",
      fields: [
        { name: "paidAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" }, width: "50%" } },
        { name: "shippedAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" }, width: "50%" } },
      ],
    },
    {
      name: "inventoryAdjusted",
      type: "checkbox",
      defaultValue: false,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Stock already taken for this order.",
      },
    },
  ],
};
