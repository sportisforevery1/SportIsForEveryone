import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Archivo } from "next/font/google";
import { Suspense } from "react";

import { MotionRoot } from "@/components/motion/MotionRoot";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { defaultMetadata } from "@/lib/seo";
import "../globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata();

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("chrome");

  return (
    <html lang={locale} className={`${archivo.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-sife-bg font-sans text-sife-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a href="#main" className="skip-link">
            {t("skip")}
          </a>
          <MotionRoot>
            <Suspense>
              <SiteHeader />
            </Suspense>
            <main id="main" className="flex flex-1 flex-col">
              {children}
            </main>
            <SiteFooter />
          </MotionRoot>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
