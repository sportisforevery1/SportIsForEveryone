import { getPayload } from "payload";
import config from "@payload-config";

import { seedInstagramPosts } from "../seed/instagram";

const payload = await getPayload({ config });
await seedInstagramPosts(payload);
process.exit(0);
