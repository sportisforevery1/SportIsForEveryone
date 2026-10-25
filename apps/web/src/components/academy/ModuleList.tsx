import { Link } from "@/i18n/navigation";
import type { CourseModulePublic } from "@/lib/courses";

type ModuleListProps = {
  courseSlug: string;
  modules: CourseModulePublic[];
};

export function ModuleList({ courseSlug, modules }: ModuleListProps) {
  return (
    <ol className="mt-10 space-y-0 border-t border-sife-ink/15">
      {modules.map((mod, index) => (
        <li
          key={mod.id}
          className="flex flex-col gap-4 border-b border-sife-ink/15 py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                Module {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
                  mod.locked ? "text-sife-ink/45" : "text-sife-navy"
                }`}
              >
                {mod.locked ? "Locked" : "Open"}
              </span>
              {mod.estimatedMinutes ? (
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sife-ink/50">
                  ~{mod.estimatedMinutes} min
                </span>
              ) : null}
              {mod.hasVideo ? (
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sife-navy">
                  Video
                </span>
              ) : null}
              {mod.hasImages ? (
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sife-navy">
                  Stills
                </span>
              ) : null}
            </div>
            <h3 className="mt-2 text-xl font-semibold uppercase tracking-[-0.03em] text-sife-ink sm:text-2xl">
              {mod.title}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-sife-ink/75 sm:text-base">
              {mod.teaser}
            </p>
          </div>
          <div className="shrink-0">
            {mod.locked ? (
              <span className="inline-flex border border-sife-ink/20 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sife-ink/45">
                Needs unlock
              </span>
            ) : (
              <Link
                href={`/academy/${courseSlug}/${mod.slug}`}
                className="btn-coral"
              >
                Open module
              </Link>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
