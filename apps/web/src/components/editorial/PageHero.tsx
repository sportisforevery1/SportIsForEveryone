import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";

type PageHeroProps = {
  label: string;
  heading: string;
  subheading?: string;
};

export function PageHero({ label, heading, subheading }: PageHeroProps) {
  return (
    <section className="px-5 pb-12 pt-16 md:px-12 md:pt-20">
      <Reveal>
        <CategoryLabel>{label}</CategoryLabel>
        <h1 className="mt-3.5 max-w-[56.25rem] text-4xl font-semibold uppercase leading-[0.94] tracking-[-0.03em] md:text-[3.5rem]">
          {heading}
        </h1>
        {subheading ? (
          <p className="mt-5 max-w-[35rem] text-base leading-normal text-sife-white/80 md:text-[1.0625rem]">
            {subheading}
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
