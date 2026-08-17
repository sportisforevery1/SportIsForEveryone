import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="px-5 pb-24 pt-20 md:px-12 md:pb-32 md:pt-28">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">{t("label")}</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold uppercase leading-[0.92] tracking-tight md:text-7xl">
        {t("title")}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-sife-white/70 md:text-lg">{t("body")}</p>
      <p className="mt-10">
        <Link href="/" className="btn-coral inline-flex">
          {t("home")}
        </Link>
      </p>
    </section>
  );
}
