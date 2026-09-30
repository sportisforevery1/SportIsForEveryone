import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import type { EditorialItem } from "@/lib/editorial";

type EditorialListProps = {
  items: EditorialItem[];
  label?: string;
  title?: string;
  cta?: string;
  tone?: "cream" | "dark";
};

export function EditorialList({
  items,
  label = "Watch / Read",
  title = "The latest stories",
  cta = "Read more",
  tone = "cream",
}: EditorialListProps) {
  if (items.length === 0) return null;

  const cream = tone === "cream";

  return (
    <section
      className={
        cream
          ? "bg-sife-cream px-5 py-20 text-sife-ink md:px-12"
          : "px-5 py-20 md:px-12"
      }
    >
      <Reveal>
        {label ? <CategoryLabel tone={cream ? "navy" : "lime"}>{label}</CategoryLabel> : null}
        {title ? (
          <h2
            className={`mt-3 text-3xl font-semibold uppercase tracking-[-0.03em] md:text-4xl ${
              cream ? "text-sife-black" : "text-sife-white"
            }`}
          >
            {title}
          </h2>
        ) : null}
        <ul className={`divide-y ${title ? "mt-9" : "mt-0"} ${cream ? "divide-sife-black/10" : "divide-sife-white/10"}`}>
          {items.map((item) => (
            <li key={item.id} className="grid items-center gap-6 py-7 md:grid-cols-[1fr_minmax(12rem,18rem)] md:gap-8">
              <div>
                <CategoryLabel tone={cream ? "navy" : "lime"}>{item.category}</CategoryLabel>
                <h3
                  className={`mt-2.5 max-w-[40rem] text-xl font-semibold uppercase leading-[1.1] tracking-[-0.03em] md:text-2xl ${
                    cream ? "text-sife-black" : "text-sife-white"
                  }`}
                >
                  {item.title}
                </h3>
                {item.meta ? (
                  <p
                    className={`mt-2 text-xs uppercase tracking-[0.16em] ${
                      cream ? "text-sife-ink/55" : "text-sife-white/55"
                    }`}
                  >
                    {item.meta}
                  </p>
                ) : null}
                {item.excerpt ? (
                  <p
                    className={`mt-2.5 max-w-[35rem] text-[0.95rem] leading-relaxed ${
                      cream ? "text-sife-ink/80" : "text-sife-white/75"
                    }`}
                  >
                    {truncate(item.excerpt, 180)}
                  </p>
                ) : null}
                <p className="mt-4">
                  <HoverUnderline href={item.href} className={`text-xs ${cream ? "text-sife-navy" : "text-sife-lime"}`}>
                    {cta}
                  </HoverUnderline>
                </p>
              </div>
              {item.image ? (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className={`hidden aspect-[16/10] md:block ${cream ? "bg-sife-lime" : "bg-sife-lime/80"}`} />
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}…`;
}
