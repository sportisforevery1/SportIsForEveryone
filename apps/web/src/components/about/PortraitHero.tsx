import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import type { MediaRef } from "@/lib/media";

type PortraitHeroProps = {
  heading: string;
  image: MediaRef;
};

export async function PortraitHero({ heading, image }: PortraitHeroProps) {
  const t = await getTranslations("chrome");

  return (
    <section className="relative min-h-[70svh] overflow-hidden bg-sife-black md:min-h-[37.5rem]">
      <ParallaxMedia
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="absolute inset-0 h-full w-full"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-sife-bg via-sife-bg/50 to-sife-bg/15" />
      <div className="relative z-10 flex min-h-[70svh] flex-col justify-end px-5 pb-16 pt-32 md:min-h-[37.5rem] md:px-12">
        <CategoryLabel>{t("about")}</CategoryLabel>
        <h1 className="mt-3.5 max-w-[56.25rem] text-4xl font-semibold uppercase leading-[0.94] tracking-[-0.03em] md:text-[3.5rem]">
          {heading}
        </h1>
      </div>
    </section>
  );
}
