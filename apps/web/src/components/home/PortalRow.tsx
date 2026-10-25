import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

const portals = [
  {
    href: "/films",
    title: "Films & Field Interviews",
    blurb: "Stories from athletes, artists and communities redefining sport",
    ctaKey: "portalWatch" as const,
    image: {
      src: "/seed/IMG_0405.jpg",
      alt: "Profile of a man in a beige hoodie, with a map of Newlands in the background, and white text reading 'Admire Muzopambwa Never Too Late'.",
      width: 1165,
      height: 1458,
    },
  },
  {
    href: "/stories",
    title: "Stories Across Borders",
    blurb: "Research, essays and field notes from around the world",
    ctaKey: "portalRead" as const,
    image: {
      src: "/seed/DSC_0073.jpg",
      alt: "Vol. 01 — Dakar",
      width: 2048,
      height: 2048,
    },
  },
  {
    href: "/database",
    title: "Explore the Network",
    blurb: "Find grassroots projects and initiatives around the world",
    ctaKey: "portalDatabase" as const,
    image: {
      src: "/seed/oumou-x-roots.jpg",
      alt: "Community hike with Sport is for Everyone",
      width: 1600,
      height: 1066,
    },
  },
] as const;

export async function PortalRow() {
  const t = await getTranslations("home");

  return (
    <section className="sife-section bg-sife-black px-5 md:px-12">
      <Reveal>
        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {portals.map((portal) => (
            <Link key={portal.href} href={portal.href} className="group block">
              <div className="overflow-hidden">
                <Image
                  src={portal.image.src}
                  alt={portal.image.alt}
                  width={portal.image.width}
                  height={portal.image.height}
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <h2 className="sife-display mt-4">{portal.title}</h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-sife-white/70">{portal.blurb}</p>
              <span className="sife-hover-underline mt-4 text-sife-lime">{t(portal.ctaKey)}</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
