import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { numbered } from "@/lib/site";

type NumberedBandProps = {
  label: string;
  title?: string;
  items: readonly { title: string; text: string }[];
};

const columns: Record<number, string> = {
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

export function NumberedBand({ label, title, items }: NumberedBandProps) {
  return (
    <section className="bg-sife-lime px-5 py-16 text-sife-black md:px-12 md:py-[4.5rem]">
      <Reveal>
        <CategoryLabel tone="navy">{label}</CategoryLabel>
        {title ? (
          <h2 className="mt-3 max-w-[47.5rem] text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] md:text-4xl">
            {title}
          </h2>
        ) : null}
        <ul className={`${title ? "mt-10" : "mt-8"} grid gap-8 ${columns[items.length] ?? "md:grid-cols-3"}`}>
          {items.map((item, index) => (
            <li key={item.title} className="border-t-2 border-sife-black pt-[1.125rem]">
              <span className="block text-[3.5rem] font-semibold leading-none tracking-[-0.04em]">{numbered(index)}</span>
              <h3 className="mt-4 text-xl font-semibold uppercase tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-sife-black/80">{item.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
