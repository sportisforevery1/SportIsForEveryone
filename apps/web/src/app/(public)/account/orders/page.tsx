import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Link } from "@/i18n/navigation";
import { ensureLoggedIn } from "@/lib/auth/actions";
import { getSessionUser } from "@/lib/auth/session";
import { getCms } from "@/lib/cms";
import { formatEur } from "@/lib/shop-model";

export const metadata: Metadata = {
  title: "My orders | Sport is for Everyone",
};

export default async function AccountOrdersPage() {
  await ensureLoggedIn("/account/orders");
  const [user, t] = await Promise.all([getSessionUser(), getTranslations("account")]);

  const payload = await getCms();
  const orders = user
    ? await payload.find({
        collection: "orders",
        where: { user: { equals: user.id } },
        limit: 50,
        depth: 0,
        sort: "-createdAt",
        overrideAccess: true,
      })
    : { docs: [] };

  return (
    <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6">
          <Link href="/account" className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral">
            ← {t("label")}
          </Link>
        </p>
        <CategoryLabel tone="navy">{t("myOrders")}</CategoryLabel>
        <h1 className="sife-display mt-3 text-sife-ink">{t("ordersTitle")}</h1>
        {orders.docs.length === 0 ? (
          <p className="mt-8 max-w-lg text-base text-sife-ink/75">{t("ordersEmpty")}</p>
        ) : (
          <ul className="mt-10 divide-y divide-sife-ink/15 border-t border-sife-ink/15">
            {orders.docs.map((order) => (
              <li key={order.id} className="py-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sife-navy/55">
                  {order.orderNumber}
                </p>
                <p className="mt-2 text-lg font-semibold uppercase tracking-tight">
                  {order.paymentStatus} · {order.fulfillmentStatus}
                </p>
                <p className="mt-1 text-sm text-sife-ink/65">
                  {typeof order.total === "number" ? formatEur(order.total) : null}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10">
          <Link href="/shop" className="text-xs font-bold uppercase tracking-[0.16em] text-sife-navy">
            {t("browseShop")} →
          </Link>
        </p>
      </div>
    </section>
  );
}
