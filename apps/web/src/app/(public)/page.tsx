import { EditorialList } from "@/components/editorial/EditorialList";
import { CinematicHero } from "@/components/home/CinematicHero";
import { FeaturedFilm } from "@/components/home/FeaturedFilm";
import { NetworkCta } from "@/components/home/NetworkCta";
import { PortalRow } from "@/components/home/PortalRow";
import { PreviousEvents } from "@/components/home/PreviousEvents";
import { Marquee } from "@/components/motion/Marquee";
import { getHomeData } from "@/lib/home";

export const revalidate = 60;

export default async function HomePage() {
  const home = await getHomeData();

  return (
    <>
      <CinematicHero manifesto={home.heroManifesto} image={home.heroImage} />
      <Marquee
        text={home.manifesto}
        className="bg-sife-lime py-4 text-sm font-semibold uppercase tracking-[0.18em] text-sife-black"
      />
      <PortalRow />
      <EditorialList items={home.latest} />
      {home.featuredFilm ? <FeaturedFilm film={home.featuredFilm} /> : null}
      <NetworkCta />
      <PreviousEvents events={home.events} />
    </>
  );
}
