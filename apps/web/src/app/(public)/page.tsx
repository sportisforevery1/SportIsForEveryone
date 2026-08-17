import Link from "next/link";

import { heroManifesto, manifesto } from "@/lib/site";

export default function HomePage() {
  return (
    <section className="flex flex-1 flex-col justify-center px-5 py-24 md:px-12">
      <p className="mb-6 text-xs uppercase tracking-[0.28em] text-sife-lime">
        Sport is for Everyone
      </p>
      <h1 className="max-w-5xl text-4xl font-semibold uppercase leading-[0.95] tracking-tight text-sife-white md:text-7xl">
        {heroManifesto}
      </h1>
      <p className="mt-8 max-w-xl text-base leading-relaxed text-sife-white/70 md:text-lg">
        Foundation phase: brand tokens, Archivo, and site chrome are in place.
        Content and motion come next.
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
      <p className="mt-16 text-sm uppercase tracking-[0.18em] text-sife-lime">
        {manifesto}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <span className="bg-sife-lime px-3 py-2 text-xs uppercase tracking-[0.14em] text-sife-black">
          Lime
        </span>
        <span className="bg-sife-navy px-3 py-2 text-xs uppercase tracking-[0.14em] text-sife-white">
          Navy
        </span>
        <span className="bg-sife-coral px-3 py-2 text-xs uppercase tracking-[0.14em] text-sife-white">
          Coral
        </span>
        <span className="bg-sife-cream px-3 py-2 text-xs uppercase tracking-[0.14em] text-sife-ink">
          Cream
        </span>
      </div>
    </section>
  );
}
