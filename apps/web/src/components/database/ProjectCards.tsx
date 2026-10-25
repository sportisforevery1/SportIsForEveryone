import type { DirectoryProject } from "@/lib/directory";

export function ProjectCards({
  projects,
  emptyLabel = "No matching projects.",
}: {
  projects: DirectoryProject[];
  emptyLabel?: string;
}) {
  if (projects.length === 0) {
    return <p className="mt-10 text-base text-sife-ink/70">{emptyLabel}</p>;
  }

  return (
    <ul className="mt-10 divide-y divide-sife-ink/15 border-t border-sife-ink/15">
      {projects.map((project) => (
        <li
          key={project.id}
          className="grid gap-3 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sife-navy/55">
              {project.location || project.region || "Directory"}
            </p>
            <h2 className="mt-2 text-xl font-semibold uppercase leading-tight tracking-tight text-sife-ink md:text-2xl">
              {project.name}
            </h2>
            {project.tags.length > 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-sife-ink/65">
                {project.tags.map((tag) => tag.name).join(" · ")}
              </p>
            ) : null}
          </div>
          {(project.instagram || project.website) && (
            <p className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.16em]">
              {project.instagram ? (
                <a
                  href={project.instagram}
                  className="text-sife-coral"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              ) : null}
              {project.website ? (
                <a
                  href={project.website}
                  className="text-sife-coral"
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              ) : null}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
