import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { EditorialList } from "@/components/editorial/EditorialList";
import { CinematicHero } from "@/components/home/CinematicHero";
import { FeaturedFilm } from "@/components/home/FeaturedFilm";
import { NetworkCta } from "@/components/home/NetworkCta";
import { PortalRow } from "@/components/home/PortalRow";
import { PreviousEvents } from "@/components/home/PreviousEvents";
import { Marquee } from "@/components/motion/Marquee";
import { getHomeData } from "@/lib/home";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("home", {
    title: "Sport is for Everyone | Join the Movement for Inclusive Sport",
    description:
      "Discover global stories, films, and initiatives promoting inclusive and accessible sport for all communities worldwide.",
  });
}

export default async function HomePage() {
  const [home, t] = await Promise.all([getHomeData(), getTranslations("home")]);

  return (
    <>
      <CinematicHero manifesto={home.heroManifesto} image={home.heroImage} />
      <Marquee
        text={home.manifesto}
        className="bg-sife-lime py-4 text-sm font-semibold uppercase tracking-[0.18em] text-sife-black"
      />
      <PortalRow />
      <EditorialList
        items={home.latest}
        label={t("latestLabel")}
        title={t("latestTitle")}
        cta={t("readMore")}
      />
      {home.featuredFilm ? <FeaturedFilm film={home.featuredFilm} /> : null}
      <NetworkCta />
      <PreviousEvents events={home.events} />
    </>
  );
}
