import { getTranslations } from "next-intl/server";

import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import type { MediaRef } from "@/lib/media";

type CinematicHeroProps = {
  manifesto: string;
  image: MediaRef;
};

export async function CinematicHero({ manifesto, image }: CinematicHeroProps) {
  const t = await getTranslations("chrome");

  return (
    <section className="relative min-h-[80svh] overflow-hidden bg-sife-black md:min-h-[45rem]">
      <ParallaxMedia
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="absolute inset-0 h-full w-full"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-sife-bg via-sife-bg/45 to-sife-bg/15" />
      <div className="relative z-10 flex min-h-[80svh] flex-col justify-end px-5 pb-20 pt-32 md:min-h-[45rem] md:px-12 md:pb-[4.5rem]">
        <p className="mb-[1.125rem] text-xs uppercase tracking-[0.28em] text-sife-lime">
          Sport is for Everyone
        </p>
        <h1 className="max-w-[55rem] text-pretty text-4xl font-semibold uppercase leading-[0.94] tracking-[-0.03em] text-sife-white md:text-[4rem]">
          {manifesto}
        </h1>
      </div>
      <div className="sife-scroll-cue pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-sife-lime" aria-hidden>
        <span className="block text-[0.625rem] uppercase tracking-[0.28em]">{t("scroll")}</span>
        <span className="mx-auto mt-2 block h-7 w-px bg-sife-lime" />
      </div>
    </section>
  );
}
