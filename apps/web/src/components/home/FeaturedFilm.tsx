import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Reveal } from "@/components/motion/Reveal";
import { PlayBadge } from "@/components/watch/PlayBadge";
import { Link } from "@/i18n/navigation";
import type { HomeFilm } from "@/lib/home";

export async function FeaturedFilm({ film }: { film: HomeFilm }) {
  const t = await getTranslations("home");
  const tWatch = await getTranslations("watch");
  const meta = [film.location, film.year, film.runtime].filter(Boolean).join(" · ");

  return (
    <section className="px-5 py-20 md:px-12">
      <Reveal>
        <div className="grid items-center gap-8 lg:grid-cols-[40rem_minmax(0,1fr)] lg:gap-14">
          <Link href={film.href} className="group relative block aspect-video overflow-hidden bg-sife-black">
            {film.image ? (
              <Image
                src={film.image.src}
                alt={film.image.alt}
                width={film.image.width}
                height={film.image.height}
                sizes="(min-width: 1024px) 640px, 100vw"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full items-end bg-sife-lime p-8 text-sife-black">
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">{tWatch("archiveFallback")}</p>
              </div>
            )}
            <PlayBadge label={t("watchFilm")} />
          </Link>
          <div>
            <CategoryLabel>{t("featuredFilm")}</CategoryLabel>
            <h2 className="mt-3 text-3xl font-semibold uppercase leading-[1.05] tracking-[-0.03em] md:text-[2rem]">
              {film.title}
            </h2>
            {meta ? (
              <p className="mt-2.5 text-xs uppercase tracking-[0.16em] text-sife-white/65">{meta}</p>
            ) : null}
            {film.excerpt ? (
              <p className="mt-[1.125rem] max-w-[32.5rem] text-[0.95rem] leading-relaxed text-sife-white/80">
                {film.excerpt}
              </p>
            ) : null}
            <p className="mt-[1.375rem]">
              <HoverUnderline href={film.href} className="text-xs text-sife-lime">
                {t("watchFilm")}
              </HoverUnderline>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
