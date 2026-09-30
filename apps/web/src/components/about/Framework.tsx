import { getTranslations } from "next-intl/server";

import { NumberedBand } from "@/components/about/NumberedBand";
import { framework } from "@/lib/site";

export async function Framework() {
  const t = await getTranslations("about");

  return <NumberedBand label={t("frameworkLabel")} title={t("frameworkTitle")} items={framework} />;
}
