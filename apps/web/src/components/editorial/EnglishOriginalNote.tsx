import { getLocale, getTranslations } from "next-intl/server";

export async function EnglishOriginalNote() {
  const locale = await getLocale();
  if (locale !== "de") return null;

  const t = await getTranslations("note");

  return (
    <p className="mb-8 max-w-xl text-xs uppercase tracking-[0.16em] text-sife-white/45">{t("englishOriginal")}</p>
  );
}

export async function EnglishOriginalNoteInk() {
  const locale = await getLocale();
  if (locale !== "de") return null;

  const t = await getTranslations("note");

  return (
    <p className="mb-8 max-w-xl text-xs uppercase tracking-[0.16em] text-sife-ink/50">{t("englishOriginal")}</p>
  );
}
