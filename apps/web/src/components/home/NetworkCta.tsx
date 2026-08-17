import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";

export function NetworkCta() {
  return (
    <section className="bg-sife-lime px-5 py-20 text-sife-black md:px-12 md:py-24">
      <Reveal>
        <h2 className="max-w-3xl text-3xl font-semibold uppercase leading-tight tracking-tight md:text-5xl">
          Are you part of a grassroots initiative?
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed md:text-lg">
          Add your project to the global database and connect with the community
        </p>
        <Link href="/join" className="btn-coral mt-8 inline-flex">
          Join the network
        </Link>
      </Reveal>
    </section>
  );
}
