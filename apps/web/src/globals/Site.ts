import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

import { anyone } from "../access/anyone";
import { authenticated } from "../access/authenticated";

export const Site: GlobalConfig = {
  slug: "site",
  label: "Site",
  admin: {
    description:
      "Manifesto, contact, socials, shop visibility, and chrome copy used across the public site.",
    group: "Settings",
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag("site-settings", { expire: 0 });
      },
    ],
  },
  fields: [
    {
      name: "heroManifesto",
      type: "textarea",
      defaultValue: "Making sport socially, culturally & structurally for everyone",
      admin: {
        description: "Home hero line. Keep verbatim unless the founder changes it.",
      },
    },
    {
      name: "manifesto",
      type: "textarea",
      defaultValue: "Making sport culturally, socially & structurally for everyone",
      admin: {
        description: "Footer / marquee line.",
      },
    },
    {
      name: "contactEmail",
      type: "email",
      defaultValue: "Hi@sportisforeveryone.org",
    },
    {
      name: "locationLines",
      type: "array",
      minRows: 1,
      defaultValue: [{ line: "Berlin, Germany" }, { line: "The Internet, Earth" }],
      fields: [
        {
          name: "line",
          type: "text",
          required: true,
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "instagramUrl",
          type: "text",
          defaultValue: "https://instagram.com/sportisforevery1",
          admin: { width: "50%" },
        },
        {
          name: "youtubeUrl",
          type: "text",
          defaultValue: "https://www.youtube.com/@SportisforEvery1",
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "defaultOgImage",
      type: "upload",
      relationTo: "media",
      label: "Default Open Graph image",
    },
    {
      name: "shopPublic",
      type: "checkbox",
      label: "Shop is public",
      defaultValue: false,
      admin: {
        description:
          "When off, /shop is hidden from the site (nav, footer, directory) and returns 404. Turn on when editions are ready to sell.",
        position: "sidebar",
      },
    },
    {
      name: "nav",
      type: "array",
      admin: {
        description: "Optional override of the public nav. Leave empty to keep the built-in IA.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "href",
          type: "text",
        },
        {
          name: "children",
          type: "array",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "href",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "footerLinks",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "href",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
