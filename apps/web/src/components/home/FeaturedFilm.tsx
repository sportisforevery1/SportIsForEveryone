import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { Reveal } from "@/components/motion/Reveal";
import type { HomeFilm } from "@/lib/home";

export function FeaturedFilm({ film }: { film: HomeFilm }) {
  return (
    <section className="px-5 py-20 md:px-12 md:py-28">
      <Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <CategoryLabel>Featured short film</CategoryLabel>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold uppercase leading-tight tracking-tight md:text-5xl">
              {film.title}
            </h2>
            {film.location || film.runtime ? (
              <p className="mt-4 text-sm uppercase tracking-[0.16em] text-sife-white/60">
                {[film.location, film.runtime].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            {film.excerpt ? (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-sife-white/75">
                {film.excerpt}
              </p>
            ) : null}
            <p className="mt-8">
              <HoverUnderline href={film.href} className="text-sife-lime">
                Watch
              </HoverUnderline>
            </p>
          </div>
          {film.image ? (
            <ParallaxMedia
              src={film.image.src}
              alt={film.image.alt}
              width={film.image.width}
              height={film.image.height}
              className="aspect-[4/5] w-full"
            />
          ) : (
            <div className="flex aspect-[4/5] items-end bg-sife-lime p-8 text-sife-black">
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                An ongoing archive of films that move literally and metaphorically
              </p>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
