import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { framework, numbered } from "@/lib/site";

/** Numbered lime band for About framework. */
export function Framework() {
  return (
    <section className="sife-section bg-sife-lime px-5 text-sife-true-black md:px-12">
      <Reveal>
        <CategoryLabel tone="navy">Our framework</CategoryLabel>
        <h2 className="sife-display mt-4 max-w-3xl text-sife-true-black">
          Three interconnected dimensions
        </h2>
        <ul className="mt-10 grid gap-10 md:grid-cols-3">
          {framework.map((item, index) => (
            <li key={item.title}>
              <p className="font-mono text-sm font-semibold tabular-nums tracking-wide text-sife-navy/70">
                {numbered(index)}
              </p>
              <h3 className="mt-3 text-xl font-semibold uppercase tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sife-true-black/75">{item.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
