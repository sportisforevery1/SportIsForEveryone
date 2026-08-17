import type { Metadata } from "next";
import { Archivo } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "../globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sport is for Everyone | Join the Movement for Inclusive Sport",
  description:
    "Discover global stories, films, and initiatives promoting inclusive and accessible sport for all communities worldwide.",
  icons: {
    icon: "/brand/favicon.ico",
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-sife-black font-sans text-sife-white antialiased">
        <a href="#main" className="skip-link">
          Skip to Content
        </a>
        <SiteHeader />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
