import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { numbered, workServices } from "@/lib/site";

/** Numbered lime band — PDF Work with Us screen. */
export function WorkPoints() {
  return (
    <section className="sife-section bg-sife-lime px-5 text-sife-true-black md:px-12">
      <CategoryLabel tone="navy">How we work</CategoryLabel>
      <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {workServices.map((item, index) => (
          <li key={item.title} className="border-t-2 border-sife-true-black/20 pt-6">
            <p className="text-[3rem] font-semibold leading-none tracking-[-0.04em] text-sife-navy md:text-[3.5rem]">
              {numbered(index)}
            </p>
            <h3 className="mt-4 text-xl font-semibold uppercase tracking-tight md:text-2xl">{item.title}</h3>
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
