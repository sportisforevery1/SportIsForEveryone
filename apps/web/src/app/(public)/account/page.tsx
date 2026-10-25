import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Link } from "@/i18n/navigation";
import { logoutAction } from "@/lib/auth/actions";
import { ensureLoggedIn } from "@/lib/auth/actions";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Account | Sport is for Everyone",
};

export default async function AccountPage() {
  await ensureLoggedIn("/account");
  const [user, t] = await Promise.all([getSessionUser(), getTranslations("account")]);

  return (
    <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
      <div className="mx-auto max-w-2xl">
        <CategoryLabel tone="navy">{t("label")}</CategoryLabel>
        <h1 className="sife-display mt-3 text-sife-ink">{t("title")}</h1>
        <p className="mt-4 text-base text-sife-ink/75">
          {user?.name ? `${user.name} · ` : ""}
          {user?.email}
        </p>
        <ul className="mt-10 space-y-4 border-t border-sife-ink/15 pt-8">
          <li>
            <Link href="/account/courses" className="text-lg font-semibold uppercase tracking-tight text-sife-navy">
              {t("myCourses")} →
            </Link>
          </li>
          <li>
            <Link href="/account/orders" className="text-lg font-semibold uppercase tracking-tight text-sife-navy">
              {t("myOrders")} →
            </Link>
          </li>
        </ul>
        <form action={logoutAction} className="mt-10">
          <button type="submit" className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral">
            {t("logout")}
          </button>
        </form>
      </div>
    </section>
  );
}
