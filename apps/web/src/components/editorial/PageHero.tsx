import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";

type PageHeroProps = {
  label: string;
  heading: string;
  subheading?: string;
  /** Tighter first fold for index pages that lead into rich media sections. */
  compact?: boolean;
};

export function PageHero({ label, heading, subheading, compact = false }: PageHeroProps) {
  return (
    <section
      className={
        compact
          ? "px-4 pb-10 pt-10 sm:px-5 sm:pb-12 sm:pt-12 md:px-12 md:pb-14 md:pt-14"
          : "px-4 pb-6 pt-10 sm:px-5 sm:pb-8 sm:pt-12 md:px-12 md:pb-10 md:pt-16"
      }
    >
      <Reveal eager>
        <CategoryLabel>{label}</CategoryLabel>
        <h1
          className="sife-display mt-3 max-w-4xl break-words text-sife-white sm:mt-4"
          style={{
            fontSize: compact
              ? "clamp(2rem, 5vw, 3.75rem)"
              : "var(--sife-hero-display)",
          }}
        >
          {heading}
        </h1>
        {subheading ? (
          <p
            className={
              compact
                ? "mt-4 max-w-xl text-sm leading-relaxed text-sife-white/75 sm:mt-5 sm:text-[0.95rem]"
                : "mt-4 max-w-2xl text-sm leading-relaxed text-sife-white/75 sm:mt-5 sm:text-base"
            }
          >
            {subheading}
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
