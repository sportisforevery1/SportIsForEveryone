import Image from "next/image";
import { Link } from "@/i18n/navigation";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import type { EditorialItem } from "@/lib/editorial";

export function SeriesCards({ items }: { items: EditorialItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-sife-cream px-5 py-20 text-sife-ink md:px-12">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="group block">
              {item.image ? (
                <div className="overflow-hidden">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              ) : (
                <div className="aspect-[4/5] bg-sife-lime" />
              )}
              <div className="mt-5">
                <CategoryLabel tone="navy">{item.category}</CategoryLabel>
              </div>
              <h2 className="mt-3 text-2xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-sife-black md:text-[1.75rem]">
                {item.title}
              </h2>
              {item.excerpt ? (
                <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-sife-ink/80">
                  {item.excerpt}
                </p>
              ) : null}
              <span className="sife-hover-underline mt-4 text-xs text-sife-navy">Read more</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
