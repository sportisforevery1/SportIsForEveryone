"use client";

import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import type { InstagramPost } from "@/lib/instagram";

const MAX_ITEMS = 16;

function toAbsoluteSrc(src: string): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  if (typeof window === "undefined") return src;
  return new URL(src, window.location.origin).toString();
}

export function InstagramGallery3D({ posts }: { posts: InstagramPost[] }) {
  const images = posts.slice(0, MAX_ITEMS).map((post) => ({
    src: toAbsoluteSrc(post.src),
    alt: post.alt || "Sport is for Everyone on Instagram",
  }));

  if (images.length === 0) return null;

  return (
    <div className="relative w-full">
      <InfiniteGallery
        images={images}
        speed={1.2}
        zSpacing={3}
        visibleCount={Math.min(12, Math.max(6, images.length))}
        falloff={{ near: 0.8, far: 14 }}
        className="h-[min(55vh,22rem)] w-full min-w-0 overflow-hidden bg-sife-cream sm:h-[min(65vh,30rem)] md:h-[min(70vh,36rem)]"
      />
      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-sife-ink/55">
        Scroll, arrows, or touch · auto-play resumes after 3s
      </p>
    </div>
  );
}
