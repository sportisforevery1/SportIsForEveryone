import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { InstagramThemes } from "@/components/home/InstagramThemes";
import { Reveal } from "@/components/motion/Reveal";
import { getInstagramPosts, instagramProfileUrl } from "@/lib/instagram";

export async function InstagramStrip() {
  const [posts, t] = await Promise.all([getInstagramPosts(), getTranslations("home")]);
  if (posts.length === 0) return null;

  return (
    <section className="sife-section overflow-hidden bg-sife-cream text-sife-black">
      <Reveal>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4 px-5 md:px-12">
          <div>
            <CategoryLabel tone="navy">{t("instagramLabel")}</CategoryLabel>
            <h2 className="sife-display mt-3">{t("instagramTitle")}</h2>
          </div>
          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral"
          >
            {t("instagramFollow")}
          </a>
        </div>
      </Reveal>
      <InstagramThemes posts={posts} compareLabel={t("instagramThemeCompare")} />
    </section>
  );
}
