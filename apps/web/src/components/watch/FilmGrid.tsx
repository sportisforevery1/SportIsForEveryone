import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import type { FilmCard } from "@/lib/watch";

type FilmGridProps = {
  films: FilmCard[];
  label: string;
  title: string;
};

export function FilmGrid({ films, label, title }: FilmGridProps) {
  if (films.length === 0) return null;

  return (
    <section className="border-t border-sife-white/20 px-5 pb-24 pt-16 md:px-12">
      <Reveal>
        <CategoryLabel>{label}</CategoryLabel>
        <h2 className="mt-3 text-3xl font-semibold uppercase tracking-[-0.03em] md:text-4xl">{title}</h2>
        <ul className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {films.map((film) => (
            <li key={film.id}>
              <Link href={film.href} className="group block">
                <div className="relative aspect-video overflow-hidden bg-sife-black">
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
                    <span className="absolute bottom-3 right-3 bg-black/70 px-[0.45rem] py-[0.2rem] text-[0.7rem] tracking-[0.1em] text-sife-white">
                      {film.runtime}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-xl font-semibold uppercase leading-[1.1] tracking-[-0.03em] transition group-hover:text-sife-lime">
                  {film.title}
                </h3>
              </Link>
              {film.meta ? (
                <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-sife-white/60">{film.meta}</p>
              ) : null}
              {film.excerpt ? (
                <p className="mt-2.5 text-sm leading-relaxed text-sife-white/80">{film.excerpt}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
