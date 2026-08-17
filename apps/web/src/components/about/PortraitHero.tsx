import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import type { MediaRef } from "@/lib/media";

type PortraitHeroProps = {
  heading: string;
  image: MediaRef;
};

export function PortraitHero({ heading, image }: PortraitHeroProps) {
  return (
    <section className="relative min-h-[80svh] overflow-hidden bg-sife-black">
      <ParallaxMedia
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-sife-black via-sife-black/50 to-sife-black/15" />
      <div className="relative z-10 flex min-h-[80svh] flex-col justify-end px-5 pb-16 pt-32 md:px-12 md:pb-20">
        <CategoryLabel>About</CategoryLabel>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold uppercase leading-[0.92] tracking-tight md:text-7xl">
          {heading}
        </h1>
      </div>
    </section>
  );
}
