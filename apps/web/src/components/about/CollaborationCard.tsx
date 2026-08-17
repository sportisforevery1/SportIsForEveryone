import Image from "next/image";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import type { PublicCollaboration } from "@/lib/about";

export function CollaborationCard({ collaboration }: { collaboration: PublicCollaboration }) {
  return (
    <section className="bg-sife-black px-5 py-20 md:px-12 md:py-28">
      <Reveal>
        <CategoryLabel>Previous collaboration</CategoryLabel>
        <div className="mt-8 grid items-center gap-10 md:grid-cols-2">
          {collaboration.image ? (
            <Image
              src={collaboration.image.src}
              alt={collaboration.image.alt}
              width={collaboration.image.width}
              height={collaboration.image.height}
              className="aspect-[16/10] w-full object-cover"
            />
          ) : null}
          <div>
            <h2 className="text-3xl font-semibold uppercase tracking-tight md:text-5xl">
              {collaboration.title}
            </h2>
            {collaboration.summary ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-sife-white/75">
                {collaboration.summary}
              </p>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
