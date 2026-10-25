import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import type { PublicCollaboration } from "@/lib/about";

export function CollaborationPortfolio({ items }: { items: PublicCollaboration[] }) {
  if (items.length === 0) return null;

  return (
    <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
      <Reveal>
        <CategoryLabel tone="navy">Past projects</CategoryLabel>
        <h2 className="sife-display mt-3 max-w-3xl text-sife-ink">Selected collaborations</h2>
        <ul className="mt-10 space-y-12 md:space-y-16">
          {items.map((item, index) => (
            <li
              key={item.title}
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
                index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    className="aspect-[16/10] w-full object-cover transition duration-500 ease-out hover:scale-[1.03]"
                  />
                ) : (
                  <div className="aspect-[16/10] bg-sife-navy/10" />
                )}
              </div>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-sife-navy/55">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="sife-display mt-3 text-sife-ink">{item.title}</h3>
                {item.summary ? (
                  <p className="mt-4 max-w-md text-base leading-relaxed text-sife-ink/75">
                    {item.summary}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
