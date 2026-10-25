import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import type { FilmCard } from "@/lib/watch";

type FilmGridProps = {
  films: FilmCard[];
  label: string;
  title?: string;
};

/** Three-up archive with durations (PDF films screen). */
export function FilmGrid({ films, label, title }: FilmGridProps) {
  if (films.length === 0) return null;

  return (
    <section className="sife-section border-t border-sife-white/15 px-5 md:px-12">
      <Reveal>
        <CategoryLabel>{label}</CategoryLabel>
        {title ? <h2 className="sife-display mt-3">{title}</h2> : null}
        <ul className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {films.map((film) => (
            <li key={film.id}>
              <Link href={film.href} className="group block">
                <div className="relative aspect-video overflow-hidden bg-sife-true-black">
                  {film.image ? (
                    <Image
                      src={film.image.src}
                      alt={film.image.alt}
                      width={film.image.width}
                      height={film.image.height}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full bg-sife-lime/80" />
                  )}
                  {film.runtime ? (
                    <span className="absolute bottom-3 right-3 bg-sife-true-black/75 px-2 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-sife-white">
                      {film.runtime}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold uppercase leading-[1.1] tracking-tight transition group-hover:text-sife-lime md:text-xl">
                  {film.title}
                </h3>
              </Link>
              {film.meta ? (
                <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-sife-white/60">{film.meta}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
