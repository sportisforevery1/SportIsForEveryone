import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
console.log(
  `Schema ready. Collections: ${payload.config.collections.map((c) => c.slug).join(", ")}`,
);
process.exit(0);
