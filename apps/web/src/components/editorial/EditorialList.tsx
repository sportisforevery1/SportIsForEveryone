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
  /** Use on index pages where the list is near the first fold. */
  eager?: boolean;
};

export function EditorialList({
  items,
  label = "Watch / Read",
  title = "The latest stories",
  cta = "Read more",
  tone = "cream",
  eager = false,
}: EditorialListProps) {
  if (items.length === 0) return null;

  const cream = tone === "cream";

  return (
    <section
      className={
        cream
          ? "sife-section bg-sife-cream px-4 text-sife-ink sm:px-5 md:px-12"
          : "sife-section px-4 sm:px-5 md:px-12"
      }
    >
      <Reveal eager={eager}>
        {label ? <CategoryLabel tone={cream ? "navy" : "lime"}>{label}</CategoryLabel> : null}
        {title ? (
          <h2
            className={`sife-display mt-3 ${cream ? "text-sife-black" : "text-sife-white"}`}
          >
            {title}
          </h2>
        ) : null}
        <ul className={`divide-y ${title ? "mt-10 sm:mt-12" : "mt-0"} ${cream ? "divide-sife-black/10" : "divide-sife-white/10"}`}>
          {items.map((item) => (
            <li key={item.id} className="grid items-center gap-5 py-7 sm:gap-6 sm:py-8 md:grid-cols-[1fr_minmax(12rem,18rem)]">
              <div className="min-w-0">
                <CategoryLabel tone={cream ? "navy" : "lime"}>{item.category}</CategoryLabel>
                <h3
                  className={`mt-3 max-w-2xl break-words text-xl font-semibold uppercase leading-tight tracking-tight sm:text-2xl md:text-3xl ${
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
                    className={`mt-3 max-w-xl text-base leading-relaxed ${
                      cream ? "text-sife-ink/80" : "text-sife-white/75"
                    }`}
                  >
                    {truncate(item.excerpt, 180)}
                  </p>
                ) : null}
                <p className="mt-5">
                  <HoverUnderline href={item.href} className={cream ? "text-sife-navy" : "text-sife-lime"}>
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
