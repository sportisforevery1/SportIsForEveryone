import { VideoEmbed } from "@/components/watch/VideoEmbed";
import { parseVideoUrl } from "@/lib/embed";

export type CourseVideoItem = {
  label?: string | null;
  url: string;
};

type CourseVideoProps = {
  videos: CourseVideoItem[];
  title: string;
};

export function CourseVideo({ videos, title }: CourseVideoProps) {
  const items = videos.filter((v) => v.url?.trim());
  if (items.length === 0) return null;

  const primary = items[0];
  const parsed = parseVideoUrl(primary.url);
  const extras = items.slice(1);

  return (
    <div className="mb-10 space-y-6">
      {parsed?.embedSrc ? (
        <div>
          {(primary.label || parsed.hostLabel) && (
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
              {primary.label?.trim() || `Watch on ${parsed.hostLabel}`}
            </p>
          )}
          <div className="border border-sife-ink/10 bg-sife-true-black shadow-[0_0_0_1px_rgba(58,71,152,0.12)]">
            <VideoEmbed url={primary.url} title={primary.label || title} eager />
          </div>
          <p className="mt-3">
            <a
              href={parsed.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold uppercase tracking-[0.16em] text-sife-navy"
            >
              Open on {parsed.hostLabel} ↗
            </a>
          </p>
        </div>
      ) : (
        <a
          href={parsed?.externalUrl || primary.url}
          target="_blank"
          rel="noreferrer"
          className="flex aspect-video flex-col justify-end border border-sife-coral/40 bg-sife-navy px-5 py-6 text-sife-white transition-colors hover:border-sife-lime sm:px-7"
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
            {parsed?.hostLabel || "Video"}
          </p>
          <p className="mt-2 text-lg font-semibold uppercase tracking-[-0.03em]">
            {primary.label?.trim() || title}
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-sife-coral">
            Open video ↗
          </p>
        </a>
      )}

      {extras.length > 0 ? (
        <ul className="space-y-3 border-t border-sife-ink/15 pt-6">
          <li className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
            More videos
          </li>
          {extras.map((item) => {
            const info = parseVideoUrl(item.url);
            return (
              <li key={item.url}>
                <a
                  href={info?.externalUrl || item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-wrap items-baseline justify-between gap-2 border border-sife-ink/15 px-4 py-3 transition-colors hover:border-sife-navy"
                >
                  <span className="text-sm font-semibold uppercase tracking-[-0.02em] text-sife-ink group-hover:text-sife-navy">
                    {item.label?.trim() || info?.hostLabel || "Video"}
                  </span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sife-coral">
                    {info?.hostLabel || "Link"} ↗
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
