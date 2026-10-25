import Image from "next/image";

import { type InstagramPost } from "@/lib/instagram";
import { isCdnMediaSrc } from "@/lib/media";

function isRemoteFeedSrc(src: string): boolean {
  return isCdnMediaSrc(src) || src.includes("cdninstagram.com") || src.includes("fbcdn.net");
}

function Frame({ post, hidden }: { post: InstagramPost; hidden?: boolean }) {
  return (
    <a
      href={post.href}
      target="_blank"
      rel="noreferrer"
      className="sife-ig-frame no-underline"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <Image
        src={post.src}
        alt={hidden ? "" : post.alt}
        width={1080}
        height={1350}
        sizes="(min-width: 768px) 16.5rem, 70vw"
        className="aspect-[4/5] w-full object-cover"
        unoptimized={isRemoteFeedSrc(post.src)}
      />
    </a>
  );
}

export function InstagramMarquee({ posts }: { posts: InstagramPost[] }) {
  const duration = `${Math.max(56, posts.length * 3.4)}s`;

  return (
    <div className="sife-ig-ribbon" style={{ ["--ig-duration" as string]: duration }}>
      <div className="sife-ig-track">
        <div className="sife-ig-set">
          {posts.map((post) => (
            <Frame key={post.id} post={post} />
          ))}
        </div>
        <div className="sife-ig-set" aria-hidden="true">
          {posts.map((post) => (
            <Frame key={`${post.id}-loop`} post={post} hidden />
          ))}
        </div>
      </div>
    </div>
  );
}
