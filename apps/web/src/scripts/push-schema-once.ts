/**
 * One-shot: open Payload with PAYLOAD_DATABASE_PUSH=true so drizzle pushes missing columns.
 * Usage:
 *   npx cross-env PAYLOAD_DATABASE_PUSH=true payload run src/scripts/push-schema-once.ts
 */
import { getPayload } from "payload";

import config from "@payload-config";

const payload = await getPayload({ config });
const site = await payload.findGlobal({ slug: "site", depth: 0 });
console.log("Schema push OK. site.shopPublic =", site.shopPublic);
process.exit(0);
