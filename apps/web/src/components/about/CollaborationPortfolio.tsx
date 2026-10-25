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
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-sife-ink/70 md:text-base">
          Institutions, brands, and public programs — each shape is different; the framework stays.
        </p>
        <ul className="mt-12 space-y-14 md:space-y-20">
          {items.map((item, index) => (
            <li
              key={`${item.title}-${index}`}
              className={`grid items-center gap-6 md:grid-cols-2 md:gap-12 ${
                index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden bg-sife-navy/10">
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    className="aspect-[16/10] w-full object-cover transition duration-500 ease-out hover:scale-[1.03]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div className="aspect-[16/10] bg-sife-navy/15" />
                )}
              </div>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold uppercase leading-[0.95] tracking-tight text-sife-ink">
                  {item.title}
                </h3>
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
