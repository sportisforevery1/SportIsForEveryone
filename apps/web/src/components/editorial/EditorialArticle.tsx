import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { RichText } from "@/components/editorial/RichText";
import { HoverUnderline } from "@/components/motion/HoverUnderline";
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
  return (
    <article className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
      <Reveal>
        <p className="mb-8">
          <HoverUnderline href={backHref} className="text-sife-navy">
            {backLabel}
          </HoverUnderline>
        </p>
        <CategoryLabel tone="navy">{category}</CategoryLabel>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold uppercase leading-[0.92] tracking-tight text-sife-black md:text-6xl">
          {title}
        </h1>
        {meta ? (
          <p className="mt-4 text-sm uppercase tracking-[0.16em] text-sife-ink/55">{meta}</p>
        ) : null}
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="mt-10 aspect-[16/9] w-full object-cover"
          />
        ) : null}
        {body ? (
          <div className="mt-12 max-w-3xl text-sife-ink">
            <RichText data={body} />
          </div>
        ) : excerpt ? (
          <p className="mt-12 max-w-3xl text-lg leading-relaxed text-sife-ink/80">{excerpt}</p>
        ) : null}
      </Reveal>
    </article>
  );
}
