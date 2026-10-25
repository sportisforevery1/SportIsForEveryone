import { InstagramGallery3D } from "@/components/home/InstagramGallery3D";
import type { InstagramPost } from "@/lib/instagram";

export type InstagramThemeId = "depth";

export function InstagramThemes({
  posts,
}: {
  posts: InstagramPost[];
  /** @deprecated Theme compare UI removed — Depth is the only layout. */
  compareLabel?: string;
}) {
  return (
    <div className="w-full">
      <InstagramGallery3D posts={posts} />
    </div>
  );
}
