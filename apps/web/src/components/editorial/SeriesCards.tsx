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
    <section className="bg-sife-cream px-4 py-12 text-sife-ink sm:px-5 sm:py-16 md:px-12 md:py-24">
      <Reveal>
        <header className="max-w-3xl border-b border-sife-ink/15 pb-8 sm:pb-10">
          <CategoryLabel tone="navy">{label}</CategoryLabel>
          <h2 className="sife-display mt-3 text-sife-ink">{title}</h2>
          {subheading ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-sife-ink/70 sm:text-base">{subheading}</p>
          ) : null}
        </header>

        <ol className="mt-10 grid gap-12 sm:mt-12 md:grid-cols-2 md:gap-x-10 md:gap-y-0">
          {items.map((item, index) => {
            const num = volumeIndex(item, index);
            const place = volumePlace(item.title);

            return (
              <li
                key={item.id}
                className={index === 1 ? "lg:mt-16" : undefined}
              >
                <Link href={item.href} className="group block">
                  <div className="mb-4 flex items-end justify-between gap-4 border-b border-sife-ink/15 pb-3">
                    <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                      Vol. {num}
                    </span>
                    <span className="text-[clamp(2.5rem,6vw,3.75rem)] font-semibold leading-none tracking-[-0.05em] text-sife-navy/25 transition group-hover:text-sife-navy/45">
                      {num}
                    </span>
                  </div>

                  {item.image ? (
                    <div className="overflow-hidden">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        sizes="(min-width: 768px) 44vw, 100vw"
                        className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-sife-lime" />
                  )}

                  <div className="mt-5">
                    <h3 className="text-[clamp(1.6rem,3vw,2.15rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-sife-ink transition group-hover:text-sife-navy">
                      {place}
                    </h3>
                    {item.excerpt ? (
                      <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-sife-ink/70">
                        {item.excerpt}
                      </p>
                    ) : null}
                    <span className="sife-hover-underline mt-5 inline-block text-xs text-sife-coral">
                      {cta}
                    </span>
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
