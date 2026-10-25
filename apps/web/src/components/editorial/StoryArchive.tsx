import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import type { EditorialItem } from "@/lib/editorial";

type StoryArchiveProps = {
  items: EditorialItem[];
  label?: string;
  title?: string;
  subheading?: string;
  cta?: string;
};

export function StoryArchive({
  items,
  label = "Archive",
  title = "More stories",
  subheading,
  cta = "Read",
}: StoryArchiveProps) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-sife-ink/10 bg-sife-cream px-4 py-14 text-sife-ink sm:px-5 sm:py-16 md:px-12 md:py-20">
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

        <ul className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {items.map((item) => (
            <li key={item.id} className="min-w-0">
              <Link href={item.href} className="group block">
                <div className="overflow-hidden bg-sife-navy/10">
                  {item.image ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="aspect-[16/10] bg-sife-lime" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold uppercase leading-[1.08] tracking-tight text-sife-ink transition group-hover:text-sife-navy md:text-xl">
                  {item.title}
                </h3>
                {item.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-sife-ink/65">
                    {item.excerpt}
                  </p>
                ) : null}
                <span className="sife-hover-underline mt-4 text-sife-coral">{cta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
