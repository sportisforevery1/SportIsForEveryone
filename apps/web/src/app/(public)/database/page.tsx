import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { DatabaseFilters } from "@/components/database/DatabaseFilters";
import { ProjectCards } from "@/components/database/ProjectCards";
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
      <PageHero label={tChrome("network")} heading={directory.heading} subheading={directory.subheading} />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-20">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-xl text-base leading-relaxed">{tDb("intro")}</p>
            <Link href="/join" className="btn-coral">
              {tDb("join")}
            </Link>
          </div>
          <DatabaseFilters
            filters={directory.filters}
            tags={directory.tags}
            cities={directory.cities}
            countries={directory.countries}
            regions={directory.regions}
            resultCount={directory.projects.length}
            total={directory.total}
          />
          <ProjectCards projects={directory.projects} emptyLabel={tDb("empty")} />
        </Reveal>
      </section>
    </>
  );
}
