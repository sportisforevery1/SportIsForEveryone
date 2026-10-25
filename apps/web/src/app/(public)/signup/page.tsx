import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/AuthForm";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Link } from "@/i18n/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { withLocale } from "@/i18n/path";

export const metadata: Metadata = {
  title: "Sign up | Sport is for Everyone",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function SignupPage({ searchParams }: Props) {
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
        <h1 className="sife-display mt-3 text-sife-ink">{t("signupTitle")}</h1>
        <p className="mt-3 text-sm text-sife-ink/70">{t("signupBody")}</p>
        <AuthForm mode="signup" next={safeNext} />
        <p className="mt-8 text-sm text-sife-ink/70">
          {t("hasAccount")}{" "}
          <Link href={`/login?next=${encodeURIComponent(safeNext)}`} className="text-sife-coral underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </section>
  );
}
