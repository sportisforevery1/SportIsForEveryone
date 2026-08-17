import type { Field, UnnamedTab } from "payload";

export const seoFields: Field[] = [
  {
    name: "seo",
    type: "group",
    label: false,
    fields: [
      {
        name: "title",
        type: "text",
        label: "Meta title",
      },
      {
        name: "description",
        type: "textarea",
        label: "Meta description",
      },
      {
        name: "image",
        type: "upload",
        relationTo: "media",
        label: "Open Graph image",
      },
    ],
  },
];

export const seoTab: UnnamedTab = {
  label: "SEO",
  fields: seoFields,
};
