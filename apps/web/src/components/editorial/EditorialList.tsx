import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import type { EditorialItem } from "@/lib/home";

export function EditorialList({ items }: { items: EditorialItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-sife-cream px-5 py-20 text-sife-ink md:px-12 md:py-28">
      <Reveal>
        <CategoryLabel tone="navy">Watch / Read</CategoryLabel>
        <h2 className="mt-3 text-3xl font-semibold uppercase tracking-tight text-sife-black md:text-5xl">
          The latest stories
        </h2>
        <ul className="mt-12 divide-y divide-sife-black/10">
          {items.map((item) => (
            <li key={item.id} className="grid items-center gap-6 py-8 md:grid-cols-[1fr_minmax(12rem,18rem)]">
              <div>
                <CategoryLabel tone="navy">{item.category}</CategoryLabel>
                <h3 className="mt-3 max-w-2xl text-2xl font-semibold uppercase leading-tight tracking-tight text-sife-black md:text-3xl">
                  {item.title}
                </h3>
                {item.excerpt ? (
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-sife-ink/80">
                    {truncate(item.excerpt, 180)}
                  </p>
                ) : null}
                <p className="mt-5">
                  <HoverUnderline href={item.href} className="text-sife-navy">
                    Read more
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
                <div className="hidden aspect-[16/10] bg-sife-lime md:block" />
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
