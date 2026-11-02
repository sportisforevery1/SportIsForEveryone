import type { ReactNode } from "react";

import { requireShopPublic } from "@/lib/site-settings";

export default async function ShopLayout({ children }: { children: ReactNode }) {
  await requireShopPublic();
  return children;
}
