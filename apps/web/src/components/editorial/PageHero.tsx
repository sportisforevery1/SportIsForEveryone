import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";

type PageHeroProps = {
  label: string;
  heading: string;
  subheading?: string;
};

export function PageHero({ label, heading, subheading }: PageHeroProps) {
  return (
    <section className="px-5 pb-12 pt-16 md:px-12 md:pb-16 md:pt-24">
      <Reveal>
        <CategoryLabel>{label}</CategoryLabel>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold uppercase leading-[0.92] tracking-tight md:text-7xl">
          {heading}
        </h1>
        {subheading ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-sife-white/75 md:text-lg">
            {subheading}
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
