import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { AuthForm } from "@/components/auth/AuthForm";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Link } from "@/i18n/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { withLocale } from "@/i18n/path";

export const metadata: Metadata = {
  title: "Log in | Sport is for Everyone",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const [{ next }, t, user, locale] = await Promise.all([
    searchParams,
    getTranslations("account"),
    getSessionUser(),
    getLocale(),
  ]);
  const safeNext = next?.startsWith("/") ? next : "/account";
  if (user) redirect(withLocale(safeNext, locale));

  return (
    <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
      <div className="mx-auto max-w-lg">
        <CategoryLabel tone="navy">{t("label")}</CategoryLabel>
        <h1 className="sife-display mt-3 text-sife-ink">{t("loginTitle")}</h1>
        <p className="mt-3 text-sm text-sife-ink/70">{t("loginBody")}</p>
        <AuthForm mode="login" next={safeNext} />
        <p className="mt-8 text-sm text-sife-ink/70">
          {t("noAccount")}{" "}
          <Link href={`/signup?next=${encodeURIComponent(safeNext)}`} className="text-sife-coral underline">
            {t("signup")}
          </Link>
        </p>
      </div>
    </section>
  );
}
