import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { framework, numbered } from "@/lib/site";

/** Numbered lime band for About framework (PDF). */
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
              <p className="text-[3.25rem] font-semibold leading-none tracking-[-0.04em] text-sife-navy">
                {numbered(index)}
              </p>
              <h3 className="mt-4 text-xl font-semibold uppercase tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sife-true-black/75">{item.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
