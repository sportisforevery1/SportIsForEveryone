import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import type { MediaRef } from "@/lib/media";

type PortraitHeroProps = {
  heading: string;
  image: MediaRef;
};

export async function PortraitHero({ heading, image }: PortraitHeroProps) {
  const t = await getTranslations("chrome");

  return (
    <section className="relative bg-sife-black">
      <div className="flex max-h-[92svh] justify-center overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority
          sizes="100vw"
          className="h-auto max-h-[92svh] w-auto max-w-full object-contain"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-sife-black via-sife-black/55 to-transparent px-5 pb-12 pt-28 md:px-12 md:pb-16">
        <CategoryLabel>{t("about")}</CategoryLabel>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold uppercase leading-[0.92] tracking-tight md:text-7xl">
          {heading}
        </h1>
      </div>
    </section>
  );
}
