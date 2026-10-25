import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import type { EditorialItem } from "@/lib/editorial";

type SeriesCardsProps = {
  items: EditorialItem[];
  label?: string;
  title?: string;
  subheading?: string;
  cta?: string;
};

function volumeIndex(item: EditorialItem, fallback: number): string {
  const fromMeta = item.meta?.match(/(\d+)/)?.[1];
  const fromTitle = item.title.match(/(\d+)/)?.[1];
  const n = Number(fromMeta || fromTitle || fallback + 1);
  return String(Number.isFinite(n) ? n : fallback + 1).padStart(2, "0");
}

function volumePlace(title: string): string {
  const parts = title.split("—").map((part) => part.trim());
  return parts[parts.length - 1] || title;
}

export function SeriesCards({
  items,
  label = "Series",
  title = "Field volumes",
  subheading = "Two chapters from the road — open either volume to read the full story.",
  cta = "Enter volume",
}: SeriesCardsProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-sife-cream px-4 py-14 text-sife-ink sm:px-5 sm:py-16 md:px-12 md:py-20">
      <Reveal>
        <header className="max-w-2xl">
          <CategoryLabel tone="navy">{label}</CategoryLabel>
          <h2 className="sife-display mt-3 text-sife-ink">{title}</h2>
          {subheading ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-sife-ink/70 sm:text-base">
              {subheading}
            </p>
          ) : null}
        </header>

        <ol className="mt-12 grid gap-10 md:mt-14 md:grid-cols-2 md:gap-8 lg:gap-12">
          {items.map((item, index) => {
            const num = volumeIndex(item, index);
            const place = volumePlace(item.title);

            return (
              <li key={item.id} className="min-w-0">
                <Link href={item.href} className="group flex h-full flex-col">
                  <div className="relative overflow-hidden bg-sife-navy/10">
                    {item.image ? (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        sizes="(min-width: 768px) 44vw, 100vw"
                        className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="aspect-[16/10] bg-sife-lime" />
                    )}
                    <span className="absolute left-3 top-3 bg-sife-cream/95 px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sife-coral">
                      Vol. {num}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-1 flex-col">
                    <h3 className="text-[clamp(1.55rem,2.8vw,2rem)] font-semibold uppercase leading-[0.98] tracking-[-0.03em] text-sife-ink transition group-hover:text-sife-navy">
                      {place}
                    </h3>
                    {item.excerpt ? (
                      <p className="mt-3 max-w-md flex-1 text-[0.95rem] leading-relaxed text-sife-ink/70">
                        {item.excerpt}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}
                    <span className="sife-hover-underline mt-5 text-sife-coral">{cta}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
