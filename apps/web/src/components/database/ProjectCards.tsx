import { CategoryLabel } from "@/components/editorial/CategoryLabel";
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
    <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <li key={project.id} className="border border-sife-black/10 bg-sife-white p-6">
          <CategoryLabel tone="navy">{project.location || project.region || "Network"}</CategoryLabel>
          <h2 className="mt-3 text-xl font-semibold uppercase leading-tight tracking-tight text-sife-black">
            {project.name}
          </h2>
          {project.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li key={tag.slug} className="sife-chip is-static">
                  {tag.name}
                </li>
              ))}
            </ul>
          ) : null}
          {project.instagram || project.website ? (
            <p className="mt-5 flex flex-wrap gap-4">
              {project.instagram ? (
                <a
                  href={project.instagram}
                  className="sife-hover-underline text-sife-navy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              ) : null}
              {project.website ? (
                <a
                  href={project.website}
                  className="sife-hover-underline text-sife-navy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              ) : null}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
