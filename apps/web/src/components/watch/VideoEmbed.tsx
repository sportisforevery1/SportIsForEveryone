import { embedSrc } from "@/lib/embed";

type VideoEmbedProps = {
  url: string | null;
  title: string;
};

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  const src = embedSrc(url);

  if (!src) {
    return (
      <div className="flex aspect-video items-end bg-sife-lime p-8 text-sife-black">
        <p className="max-w-md text-sm font-semibold uppercase tracking-[0.18em]">
          An ongoing archive of films that move literally and metaphorically
        </p>
      </div>
    );
  }

  return (
    <div className="sife-embed">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
