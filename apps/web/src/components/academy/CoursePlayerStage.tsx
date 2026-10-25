import { VideoEmbed } from "@/components/watch/VideoEmbed";
import { parseVideoUrl } from "@/lib/embed";
import type { CourseModuleVideo } from "@/lib/courses";

type CoursePlayerStageProps = {
  title: string;
  locked: boolean;
  hasVideo: boolean;
  videos: CourseModuleVideo[];
};

export function CoursePlayerStage({ title, locked, hasVideo, videos }: CoursePlayerStageProps) {
  if (locked) {
    return (
      <div className="relative aspect-video w-full bg-sife-navy">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sife-lime">
            Locked
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-sife-white/75">
            Unlock this chapter to watch{hasVideo ? " the video" : ""} and read the notes.
          </p>
        </div>
      </div>
    );
  }

  const primary = videos[0];
  if (!primary) {
    return (
      <div className="flex aspect-video items-center justify-center bg-sife-navy px-6 text-center">
        <p className="text-sm uppercase tracking-[0.16em] text-sife-lime/80">Notes-only chapter</p>
      </div>
    );
  }

  const parsed = parseVideoUrl(primary.url);

  return (
    <div>
      <div className="overflow-hidden bg-black">
        <VideoEmbed url={primary.url} title={primary.label || title} eager />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sife-white/55">
          {primary.label || parsed?.hostLabel || "Lesson video"}
        </p>
        {parsed?.externalUrl ? (
          <a
            href={parsed.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sife-lime"
          >
            Open on {parsed.hostLabel} ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}
