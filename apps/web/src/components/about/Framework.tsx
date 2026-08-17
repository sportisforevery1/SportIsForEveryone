import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { framework } from "@/lib/site";

export function Framework() {
  return (
    <section className="bg-sife-black px-5 py-20 md:px-12 md:py-28">
      <Reveal>
        <CategoryLabel>Our framework</CategoryLabel>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold uppercase leading-tight tracking-tight md:text-5xl">
          We operate through three interconnected dimensions
        </h2>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {framework.map((item) => (
            <li key={item.title} className="border-t-2 border-sife-lime pt-6">
              <h3 className="text-xl font-semibold uppercase tracking-tight">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-sife-white/75">{item.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
