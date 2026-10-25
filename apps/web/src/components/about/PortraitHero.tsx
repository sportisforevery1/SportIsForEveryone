import Image from "next/image";

import type { MediaRef } from "@/lib/media";

type PortraitHeroProps = {
  heading: string;
  image: MediaRef;
};

export function PortraitHero({ heading, image }: PortraitHeroProps) {
  return (
    <section className="relative min-h-[min(88svh,52rem)] overflow-hidden bg-sife-navy text-sife-cream">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_22%]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-sife-true-black via-sife-true-black/50 to-sife-true-black/20"
        aria-hidden
      />
      <div className="relative z-10 flex min-h-[min(88svh,52rem)] flex-col justify-end px-5 pb-10 pt-28 md:px-10 md:pb-14 md:pt-32">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="max-w-3xl font-display text-[clamp(2.75rem,9vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-tight text-sife-cream">
            {heading}
          </h1>
        </div>
      </div>
    </section>
  );
}
