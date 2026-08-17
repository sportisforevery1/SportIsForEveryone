import type { Metadata } from "next";
import Link from "next/link";

import { DatabaseFilters } from "@/components/database/DatabaseFilters";
import { ProjectCards } from "@/components/database/ProjectCards";
import { PageHero } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getDirectoryIndex } from "@/lib/directory";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Database | Sport is for Everyone",
  description: "Find the spaces that were built for you. Not the other way around.",
};

type DatabasePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DatabasePage({ searchParams }: DatabasePageProps) {
  const directory = await getDirectoryIndex(await searchParams);

  return (
    <>
      <PageHero label="Network" heading={directory.heading} subheading={directory.subheading} />
      <section className="bg-sife-cream px-5 py-16 text-sife-ink md:px-12 md:py-24">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-xl text-base leading-relaxed">
              Find grassroots projects and initiatives around the world
            </p>
            <Link href="/join" className="btn-coral">
              Join the Database
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
          <ProjectCards projects={directory.projects} />
        </Reveal>
      </section>
    </>
  );
}
