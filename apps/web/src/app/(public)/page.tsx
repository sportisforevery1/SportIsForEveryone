import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EditorialList } from "@/components/editorial/EditorialList";
import { CinematicHero } from "@/components/home/CinematicHero";
import { DirectoryIndex } from "@/components/home/DirectoryIndex";
import { FeaturedFilm } from "@/components/home/FeaturedFilm";
import { InstagramStrip } from "@/components/home/InstagramStrip";
import { ManifestoBand } from "@/components/home/ManifestoBand";
import { NetworkCta } from "@/components/home/NetworkCta";
import { SurfaceRoot } from "@/components/home/SurfaceRoot";
import { UpcomingStrip } from "@/components/home/UpcomingStrip";
import { getHomeData } from "@/lib/home";
import { cmsPageMetadata } from "@/lib/seo";
import { parseHomeSurface } from "@/lib/surfaces";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("home", {
    title: "Sport is for Everyone | Join the Movement for Inclusive Sport",
    description:
      "Discover global stories, films, and initiatives promoting inclusive and accessible sport for all communities worldwide.",
  });
}

type HomePageProps = {
  searchParams: Promise<{ surface?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [{ surface: surfaceParam }, home, t] = await Promise.all([
    searchParams,
    getHomeData(),
    getTranslations("home"),
  ]);
  const surface = parseHomeSurface(surfaceParam);

  return (
    <>
      <SurfaceRoot surface={surface} />
      <CinematicHero manifesto={home.heroManifesto} image={home.heroImage} />
      <ManifestoBand text={home.manifesto} />
      <DirectoryIndex />
      <InstagramStrip />
      {home.featuredFilm ? <FeaturedFilm film={home.featuredFilm} /> : null}
      <EditorialList
        items={home.latest}
        label={t("latestLabel")}
        title={t("latestTitle")}
        cta={t("readMore")}
      />
      <UpcomingStrip />
      <NetworkCta />
    </>
  );
}
