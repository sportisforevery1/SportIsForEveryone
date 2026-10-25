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
  ["/education", "/academy"],
  ["/privacy-policy", "/privacy"],
  ["/datenschutz", "/privacy"],
  // Education moved under the new Academy section.
  ["/education", "/academy"],
] as const;

const nextConfig: NextConfig = {
  agentRules: false,
  // YouTube embeds need a Referer (Error 153 if suppressed with same-origin / no-referrer).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  images: {
    qualities: [70, 75],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Local Payload media URLs can resolve to 127.0.0.1 during next/image optimization.
    dangerouslyAllowLocalIP: true,
    localPatterns: [
      { pathname: "/brand/**" },
      { pathname: "/seed/**" },
      { pathname: "/api/media/file/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.blob.vercel-storage.com" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/api/media/file/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "3000", pathname: "/api/media/file/**" },
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
