import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

import { defaultLocale, isLocale } from "@/i18n/config";

export default getRequestConfig(async () => {
  const headerLocale = (await headers()).get("x-locale");
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
