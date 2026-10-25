import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Collaborations } from "./collections/Collaborations";
import { CourseEnrolments } from "./collections/CourseEnrolments";
import { Courses } from "./collections/Courses";
import { Events } from "./collections/Events";
import { Films } from "./collections/Films";
import { InstagramPosts } from "./collections/InstagramPosts";
import { Interviews } from "./collections/Interviews";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders";
import { Pages } from "./collections/Pages";
import { Products } from "./collections/Products";
import { People } from "./collections/People";
import { Projects } from "./collections/Projects";
import { Stories } from "./collections/Stories";
import { Submissions } from "./collections/Submissions";
import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";
import { Site } from "./globals/Site";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Admin saves 403 if the browser origin ≠ serverURL CSRF allowlist (zeta vs eta aliases). */
const csrfOrigins = [
  ...new Set(
    [
      siteUrl,
      process.env.PAYLOAD_CSRF_EXTRA,
      "http://localhost:3000",
      "https://sport-is-for-everyone-zeta.vercel.app",
      "https://sport-is-for-everyone-eta.vercel.app",
      "https://sport-is-for-everyone.vercel.app",
      "https://sport-is-for-everyone-gihozo.vercel.app",
    ]
      .flatMap((value) => (value ? value.split(",") : []))
      .map((value) => value.trim().replace(/\/$/, ""))
      .filter(Boolean),
  ),
];

export default buildConfig({
  serverURL: siteUrl,
  csrf: csrfOrigins,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — SIFE Admin",
      icons: [{ rel: "icon", type: "image/x-icon", url: "/brand/favicon.ico" }],
    },
    components: {
      graphics: {
        Logo: "/components/admin/Logo.tsx#Logo",
        Icon: "/components/admin/Icon.tsx#Icon",
      },
      afterDashboard: ["/components/admin/InboxOverview.tsx#InboxOverview"],
    },
  },
  collections: [
    Pages,
    Films,
    Interviews,
    Stories,
    Events,
    Courses,
    CourseEnrolments,
    InstagramPosts,
    Projects,
    Tags,
    People,
    Collaborations,
    Products,
    Orders,
    Submissions,
    Media,
    Users,
  ],
  globals: [Site],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      max: 5,
      idleTimeoutMillis: process.env.VERCEL ? 10_000 : 20_000,
      connectionTimeoutMillis: process.env.VERCEL ? 15_000 : 60_000,
      // Render Postgres terminates clients that negotiate verify-full SSL poorly.
      ssl:
        process.env.DATABASE_URL?.includes("render.com") ||
        process.env.DATABASE_URL?.includes("sslmode=require")
          ? { rejectUnauthorized: false }
          : undefined,
    },
    // Set PAYLOAD_DATABASE_PUSH=true once against a fresh DB (local or staging).
    push: process.env.PAYLOAD_DATABASE_PUSH === "true",
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      // Keep true for Admin uploads on Vercel (4.5MB limit). Seed/repair use server + Blob SDK.
      clientUploads: true,
    }),
  ],
});
