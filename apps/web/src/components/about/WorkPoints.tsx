import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { numbered, workServices } from "@/lib/site";
import type { WorkPoint } from "@/lib/about";

type Props = {
  points?: WorkPoint[];
};

/** Numbered lime band — Work with Us. */
export function WorkPoints({ points }: Props) {
  const items =
    points && points.length > 0
      ? points
      : workServices.map((item) => ({ title: item.title, text: item.text }));

  return (
    <section className="sife-section bg-sife-lime px-5 text-sife-true-black md:px-12">
      <Reveal>
        <CategoryLabel tone="navy">How we work</CategoryLabel>
        <h2 className="sife-display mt-3 max-w-2xl text-sife-true-black">What we offer</h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {items.map((item, index) => (
            <li key={item.title} className="border-t-2 border-sife-true-black/25 pt-5">
              <p className="font-mono text-xs font-semibold tabular-nums tracking-[0.14em] text-sife-navy/65">
                {numbered(index)}
              </p>
              <h3 className="mt-3 text-lg font-semibold uppercase leading-tight tracking-tight md:text-xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-sife-true-black/75">{item.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
