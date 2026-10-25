import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { numbered, workServices } from "@/lib/site";

/** Numbered lime band — Work with Us. */
export function WorkPoints() {
  return (
    <section className="sife-section bg-sife-lime px-5 text-sife-true-black md:px-12">
      <CategoryLabel tone="navy">How we work</CategoryLabel>
      <h2 className="sife-display mt-3 max-w-2xl text-sife-true-black">What we offer</h2>
      <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {workServices.map((item, index) => (
          <li key={item.title} className="border-t border-sife-true-black/20 pt-5">
            <p className="font-mono text-sm font-semibold tabular-nums tracking-wide text-sife-navy/70">
              {numbered(index)}
            </p>
            <h3 className="mt-3 text-lg font-semibold uppercase tracking-tight md:text-xl">
              {item.title}
            </h3>
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-relaxed text-sife-true-black/75">
                {paragraph}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}