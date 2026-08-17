import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Collaborations } from "./collections/Collaborations";
import { Events } from "./collections/Events";
import { Films } from "./collections/Films";
import { Interviews } from "./collections/Interviews";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
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

export default buildConfig({
  serverURL: siteUrl,
  csrf: [siteUrl],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " — SIFE Admin",
    },
  },
  collections: [
    Pages,
    Films,
    Interviews,
    Stories,
    Events,
    Projects,
    Tags,
    People,
    Collaborations,
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
      clientUploads: true,
    }),
  ],
});
