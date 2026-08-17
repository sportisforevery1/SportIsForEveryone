import Link from "next/link";

import { HoverUnderline } from "@/components/motion/HoverUnderline";
import { Marquee } from "@/components/motion/Marquee";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { Reveal } from "@/components/motion/Reveal";
import { heroManifesto, manifesto } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="flex min-h-[85vh] flex-col justify-center px-5 py-24 md:px-12">
        <p className="mb-6 text-xs uppercase tracking-[0.28em] text-sife-lime">
          Sport is for Everyone
        </p>
        <h1 className="max-w-5xl text-4xl font-semibold uppercase leading-[0.95] tracking-tight text-sife-white md:text-7xl">
          {heroManifesto}
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-sife-white/70 md:text-lg">
          Motion primitives are in place. Scroll for a reveal test. Reduced-motion
          settings keep the page still.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/database" className="btn-coral">
            Database
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-sife-lime ring-1 ring-sife-lime/40 hover:bg-sife-lime hover:text-sife-black"
          >
            Admin
          </Link>
        </div>
      </section>

      <Marquee
        text={manifesto}
        className="bg-sife-lime py-4 text-sm font-semibold uppercase tracking-[0.18em] text-sife-black"
      />

      <section className="px-5 py-24 md:px-12">
        <Reveal>
          <p className="mb-4 text-xs uppercase tracking-[0.28em] text-sife-lime">
            Motion test
          </p>
          <h2 className="max-w-3xl text-3xl font-semibold uppercase leading-tight tracking-tight md:text-5xl">
            {manifesto}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-sife-white/70">
            This block fades up on enter. If you prefer reduced motion, it is already
            visible.
          </p>
          <p className="mt-8">
            <HoverUnderline href="/films" className="text-sife-lime">
              Films
            </HoverUnderline>
          </p>
        </Reveal>
      </section>

      <section className="px-5 pb-28 md:px-12">
        <ParallaxMedia
          src="/seed/IMG_1335.png"
          alt="Athletes in motion"
          width={2138}
          height={1425}
          className="aspect-[16/9] max-h-[70vh] w-full"
        />
      </section>
    </>
  );
}
