import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Archivo } from "next/font/google";
import { Suspense } from "react";

import { MotionRoot } from "@/components/motion/MotionRoot";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUser } from "@/lib/auth/session";
import { CartProvider } from "@/lib/shop-cart";
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
  const user = await getSessionUser();

  return (
    <html lang={locale} className={`${archivo.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* Required for YouTube embeds (avoids Error 153 when Referer is stripped). */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body
        className="flex min-h-full flex-col bg-sife-black font-sans text-sife-white antialiased"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
            <a href="#main" className="skip-link">
              {t("skip")}
            </a>
            <MotionRoot>
              <Suspense>
                <SiteHeader loggedIn={Boolean(user)} />
              </Suspense>
              <main id="main" className="flex w-full min-w-0 flex-1 flex-col overflow-x-clip">
                {children}
              </main>
              <SiteFooter />
              <CartDrawer />
            </MotionRoot>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
