import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const squarespaceRedirects = [
  ["/contact", "/about"],
  ["/support", "/donate"],
  ["/join-the-database", "/join"],
  ["/films-visual-stories", "/films"],
  ["/field-interview", "/interviews"],
  ["/field-interviews", "/interviews"],
  ["/stories-across-borders", "/stories"],
  ["/privacy-policy", "/privacy"],
  ["/datenschutz", "/privacy"],
  // Education moved under the new Academy section.
  ["/education", "/academy"],
] as const;

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    localPatterns: [
      { pathname: "/brand/**" },
      { pathname: "/seed/**" },
      { pathname: "/api/media/file/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
    ],
  },
  async redirects() {
    return squarespaceRedirects.flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `/de${from}`, destination: `/de${to}`, permanent: true },
    ]);
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname),
  },
};

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false });
