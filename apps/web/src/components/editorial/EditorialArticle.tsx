import { RichText } from "@/components/editorial/RichText";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { Reveal } from "@/components/motion/Reveal";
import type { MediaRef } from "@/lib/media";

type EditorialArticleProps = {
  backHref: string;
  backLabel: string;
  category: string;
  title: string;
  meta?: string;
  image?: MediaRef | null;
  body: unknown;
  excerpt?: string;
};

export function EditorialArticle({
  backHref,
  backLabel,
  category,
  title,
  meta,
  image,
  body,
  excerpt,
}: EditorialArticleProps) {
  const kicker = [category, meta].filter(Boolean).join(" · ");

  return (
    <article className="bg-sife-cream text-sife-ink">
      <header className="relative">
        {image ? (
          <div className="sife-editorial-cover relative aspect-[4/5] w-full overflow-hidden bg-sife-navy sm:aspect-[16/10] md:aspect-auto md:h-[min(78vh,44rem)]">
            <ParallaxMedia
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              className="absolute inset-0 h-full w-full"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sife-cream via-sife-cream/25 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sife-true-black/45 to-transparent sm:h-28"
              aria-hidden="true"
            />
            <p className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5 md:left-12 md:top-8">
              <HoverUnderline href={backHref} className="text-sife-white">
                {backLabel}
              </HoverUnderline>
            </p>
          </div>
        ) : (
          <div className="bg-sife-navy px-4 pb-6 pt-12 sm:px-5 md:px-12 md:pt-16">
            <p>
              <HoverUnderline href={backHref} className="text-sife-lime">
                {backLabel}
              </HoverUnderline>
            </p>
          </div>
        )}

        <div
          className={
            image
              ? "relative z-10 mx-auto -mt-16 max-w-5xl px-4 sm:-mt-24 sm:px-5 md:-mt-36 md:px-12"
              : "mx-auto max-w-5xl px-4 pt-8 sm:px-5 md:px-12 md:pt-10"
          }
        >
          <Reveal>
            <div className="max-w-4xl pb-2 pt-2">
              {kicker ? (
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sife-coral sm:text-[0.7rem]">
                  {kicker}
                </p>
              ) : null}
              <h1 className="mt-3 break-words text-[clamp(1.75rem,6.5vw,3.75rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-sife-ink sm:mt-4">
                {title}
              </h1>
              {excerpt ? (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-sife-ink/75 sm:mt-6 sm:text-lg md:text-xl">
                  {excerpt}
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </header>

      {body ? (
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-5 sm:pb-20 sm:pt-12 md:px-12 md:pb-28 md:pt-16">
          <Reveal>
            <div className="sife-prose mx-auto max-w-3xl text-sife-ink">
              <RichText data={body} />
            </div>
          </Reveal>
        </div>
      ) : null}
    </article>
  );
}
