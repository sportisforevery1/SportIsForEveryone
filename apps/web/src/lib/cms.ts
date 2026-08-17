import { getPayload } from "payload";

import config from "@payload-config";

export async function getCms() {
  return getPayload({ config });
}
