import { Archivo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import Image from "next/image";

import { Link } from "@/i18n/navigation";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export default async function GlobalNotFound() {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("notFound");

  return (
    <html lang={locale} className={`${archivo.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-sife-black font-sans text-sife-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="flex flex-1 flex-col px-5 pb-24 pt-16 md:px-12 md:pt-24">
            <Link href="/" className="mb-16 inline-flex w-fit items-center gap-3">
              <Image
                src="/brand/EmblemLime.png"
                alt="Sport is for Everyone"
                width={48}
                height={46}
                className="h-10 w-auto"
              />
            </Link>
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
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
