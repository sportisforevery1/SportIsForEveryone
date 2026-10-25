import Image from "next/image";

import type { CourseModuleImage } from "@/lib/courses";

/** Stills sit in the notes column — not under the video. */
export function CourseStills({
  images,
  title,
}: {
  images: CourseModuleImage[];
  title: string;
}) {
  if (images.length === 0) return null;

  return (
    <section className="mt-10 border-t border-sife-ink/15 pt-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
        Stills
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-sife-ink/45">
        Visual notes for this chapter
      </p>
      <ul className="mt-4 grid gap-3">
        {images.map((item, i) => (
          <li key={`${item.image.src}-${i}`}>
            <figure className="overflow-hidden border border-sife-ink/10 bg-sife-navy/5">
              <div className="relative aspect-[16/10] w-full bg-sife-navy">
                <Image
                  src={item.image.src}
                  alt={item.caption || item.image.alt || title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 28rem"
                  className="object-cover"
                />
              </div>
              {item.caption ? (
                <figcaption className="px-3 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sife-ink/55">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
