import Image from "next/image";

import { CourseVideo, type CourseVideoItem } from "@/components/academy/CourseVideo";
import type { MediaRef } from "@/lib/media";

export type CourseImageItem = {
  image: MediaRef;
  caption?: string | null;
};

type CourseMediaProps = {
  title: string;
  locked: boolean;
  videos: CourseVideoItem[];
  images: CourseImageItem[];
  hasImages: boolean;
  hasVideo: boolean;
};

function LockedMedia({ hasVideo, hasImages }: { hasVideo: boolean; hasImages: boolean }) {
  if (!hasVideo && !hasImages) return null;
  const label = [hasVideo ? "video" : null, hasImages ? "images" : null]
    .filter(Boolean)
    .join(" & ");
  return (
    <div className="mb-10 overflow-hidden border border-sife-ink/15">
      <div className="relative aspect-[16/10] bg-sife-navy sm:aspect-video">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, color-mix(in srgb, var(--sife-lime) 35%, transparent), transparent 55%), radial-gradient(ellipse at 80% 80%, color-mix(in srgb, var(--sife-coral) 28%, transparent), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 flex items-end px-5 py-6 sm:px-7">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
              Media locked
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-sife-white/80">
              Unlock this module to view the lesson {label}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageFigure({
  item,
  priority,
  frameClass,
  sizes,
}: {
  item: CourseImageItem;
  priority?: boolean;
  frameClass: string;
  sizes: string;
}) {
  return (
    <figure>
      <div className={`relative overflow-hidden bg-sife-navy ${frameClass}`}>
        <Image
          src={item.image.src}
          alt={item.image.alt || item.caption || "Course image"}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out hover:scale-[1.025]"
        />
      </div>
      {item.caption ? (
        <figcaption className="mt-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-sife-ink/55">
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function CourseImages({ images, title }: { images: CourseImageItem[]; title: string }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="mb-10">
        <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
          Still
        </p>
        <div className="border border-sife-ink/10 ring-1 ring-sife-navy/10">
          <ImageFigure
            item={images[0]}
            priority
            sizes="(max-width: 768px) 100vw, 48rem"
            frameClass="aspect-[4/5] sm:aspect-[16/10]"
          />
        </div>
        {!images[0].caption ? (
          <p className="mt-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-sife-ink/45">
            {title}
          </p>
        ) : null}
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="mb-10">
        <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
          Stills
        </p>
        <div className="grid gap-3 sm:grid-cols-[1.35fr_1fr] sm:items-stretch sm:gap-4">
          <div className="border border-sife-ink/10">
            <ImageFigure
              item={images[0]}
              priority
              sizes="(max-width: 640px) 100vw, 55vw"
              frameClass="aspect-[4/5] sm:aspect-[3/4] sm:min-h-[22rem]"
            />
          </div>
          <div className="border border-sife-ink/10">
            <ImageFigure
              item={images[1]}
              sizes="(max-width: 640px) 100vw, 40vw"
              frameClass="aspect-[4/5] sm:aspect-[3/4] sm:min-h-[22rem]"
            />
          </div>
        </div>
      </div>
    );
  }

  const [hero, ...rest] = images;
  return (
    <div className="mb-10">
      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
        Gallery
      </p>
      <div className="border border-sife-ink/10 ring-1 ring-sife-navy/10">
        <ImageFigure
          item={hero}
          priority
          sizes="(max-width: 768px) 100vw, 48rem"
          frameClass="aspect-[16/10]"
        />
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {rest.map((item, i) => (
          <li key={`${item.image.src}-${i}`} className="border border-sife-ink/10">
            <ImageFigure item={item} sizes="(max-width: 640px) 50vw, 16rem" frameClass="aspect-square" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Videos + stills for a course module — SIFE framed media stack. */
export function CourseMedia({
  title,
  locked,
  videos,
  images,
  hasImages,
  hasVideo,
}: CourseMediaProps) {
  if (locked) {
    return <LockedMedia hasVideo={hasVideo} hasImages={hasImages} />;
  }

  return (
    <>
      <CourseVideo videos={videos} title={title} />
      <CourseImages images={images} title={title} />
    </>
  );
}
