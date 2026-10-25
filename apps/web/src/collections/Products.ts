import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";
import { authenticatedOrPublishedStatus } from "../access/authenticatedOrPublished";
import { slugField } from "../fields/slug";

export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Product",
    plural: "Products",
  },
  admin: {
    group: "Shop",
    useAsTitle: "code",
    defaultColumns: ["code", "title", "price", "status", "updatedAt"],
    description: "Edition merch. Stock lives on each size variant.",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublishedStatus,
    update: authenticated,
  },
  defaultSort: "code",
  fields: [
    {
      name: "code",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Public edition code, e.g. SIFE ED1",
      },
    },
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Object name, e.g. Tee",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          required: true,
          defaultValue: "apparel",
          options: [
            { label: "Apparel", value: "apparel" },
            { label: "Accessory", value: "accessory" },
            { label: "Print", value: "print" },
          ],
          admin: { width: "33%" },
        },
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
          admin: {
            width: "33%",
            description: "EUR",
          },
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          admin: { width: "33%" },
        },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "gallery",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "variants",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "Size / stock", plural: "Inventory" },
      admin: {
        description: "Each row is a sellable size. Set stock to 0 to mark sold out.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              admin: {
                width: "33%",
                description: "XS, S, M, L, XL, or One size",
              },
            },
            {
              name: "sku",
              type: "text",
              required: true,
              admin: { width: "34%" },
            },
            {
              name: "stock",
              type: "number",
              required: true,
              min: 0,
              defaultValue: 0,
              admin: { width: "33%" },
            },
          ],
        },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
      admin: { position: "sidebar" },
    },
    slugField("code"),
  ],
};
