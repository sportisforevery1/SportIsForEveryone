import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { DatabaseFilters } from "@/components/database/DatabaseFilters";
import { ProjectCards } from "@/components/database/ProjectCards";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { PageHero } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getDirectoryIndex } from "@/lib/directory";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("database", {
    title: "Database",
    description: "Find the spaces that were built for you. Not the other way around.",
  });
}

type DatabasePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DatabasePage({ searchParams }: DatabasePageProps) {
  const [directory, tChrome, tDb] = await Promise.all([
    getDirectoryIndex(await searchParams),
    getTranslations("chrome"),
    getTranslations("database"),
  ]);

  return (
    <>
      <PageHero
        label={tChrome("network")}
        heading={directory.heading}
        subheading={directory.subheading}
        compact
      />
      <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
        <Reveal>
          <div className="flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CategoryLabel tone="navy">{tDb("join")}</CategoryLabel>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-sife-ink/80">
                {tDb("intro")}
              </p>
            </div>
            <Link href="/join" className="btn-coral shrink-0">
              {tDb("join")}
            </Link>
          </div>
        </Reveal>
      </section>
      <section className="sife-section border-t border-sife-ink/10 bg-sife-cream px-5 text-sife-ink md:px-12">
        <Reveal>
          <CategoryLabel tone="navy">Directory</CategoryLabel>
          <h2 className="sife-display mt-3 text-sife-ink">
            {directory.projects.length} of {directory.total}
          </h2>
          <div className="mt-8">
            <DatabaseFilters
              filters={directory.filters}
              tags={directory.tags}
              cities={directory.cities}
              countries={directory.countries}
              regions={directory.regions}
              resultCount={directory.projects.length}
              total={directory.total}
            />
          </div>
          <ProjectCards projects={directory.projects} emptyLabel={tDb("empty")} />
        </Reveal>
      </section>
    </>
  );
}
