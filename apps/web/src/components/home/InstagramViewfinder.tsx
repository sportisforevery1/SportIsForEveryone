"use client";

import ViewfinderFlipCarousel, {
  type ViewfinderFlipItem,
} from "@/components/ui/viewfinder-flip-carousel";
import type { InstagramPost } from "@/lib/instagram";

const MAX_ITEMS = 24;

export function InstagramViewfinder({ posts }: { posts: InstagramPost[] }) {
  const slice = posts.slice(0, MAX_ITEMS);
  const hrefs = slice.map((p) => p.href);
  const items: ViewfinderFlipItem[] = slice.map((post) => ({
    title: post.alt || "Sport is for Everyone on Instagram",
    src: post.src,
    alt: post.alt,
  }));

  if (items.length === 0) return null;

  const defaultIndex = Math.min(3, Math.max(0, items.length - 1));

  return (
    <div className="w-full min-w-0 px-2 md:px-4">
      <div className="md:hidden">
        <ViewfinderFlipCarousel
          items={items}
          height="22rem"
          size={150}
          foldedWidth={48}
          openWidth={200}
          tilt={58}
          roll={88}
          radius={4}
          frame
          duration={0.75}
          bounce={0.18}
          titles
          controls
          defaultIndex={defaultIndex}
          background="transparent"
          color="var(--sife-ink)"
          fontFamily='var(--font-archivo), ui-sans-serif, system-ui, sans-serif'
          ariaLabel="Instagram posts"
          onSelect={(_item, index) => {
            const href = hrefs[index];
            if (href) window.open(href, "_blank", "noopener,noreferrer");
          }}
        />
      </div>
      <div className="hidden md:block">
        <ViewfinderFlipCarousel
          items={items}
          height="26rem"
          size={200}
          foldedWidth={64}
          openWidth={280}
          tilt={58}
          roll={88}
          radius={4}
          frame
          duration={0.75}
          bounce={0.18}
          titles
          controls
          defaultIndex={defaultIndex}
          background="transparent"
          color="var(--sife-ink)"
          fontFamily='var(--font-archivo), ui-sans-serif, system-ui, sans-serif'
          ariaLabel="Instagram posts"
          onSelect={(_item, index) => {
            const href = hrefs[index];
            if (href) window.open(href, "_blank", "noopener,noreferrer");
          }}
        />
      </div>
    </div>
  );
}
