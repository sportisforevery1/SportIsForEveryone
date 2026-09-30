import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Reveal } from "@/components/motion/Reveal";
import type { PublicCollaboration } from "@/lib/about";

export async function CollaborationCard({ collaboration }: { collaboration: PublicCollaboration }) {
  const t = await getTranslations("work");

  return (
    <section className="relative flex min-h-[28rem] items-end overflow-hidden bg-sife-black md:min-h-[35rem]">
      {collaboration.image ? (
        <Image
          src={collaboration.image.src}
          alt={collaboration.image.alt}
          width={collaboration.image.width}
          height={collaboration.image.height}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-sife-black/85 to-sife-black/30 md:bg-gradient-to-r md:from-sife-black/85 md:via-sife-black/30 md:via-60% md:to-transparent" />
      <div className="relative z-10 max-w-[37.5rem] px-5 pb-14 md:px-12">
        <Reveal>
          <CategoryLabel>{t("previousCollaboration")}</CategoryLabel>
          <h2 className="mt-3 text-3xl font-semibold uppercase leading-none tracking-[-0.03em] md:text-[2.5rem]">
            {collaboration.title}
          </h2>
          {collaboration.summary ? (
            <p className="mt-3.5 text-[0.95rem] leading-relaxed text-sife-white/85">{collaboration.summary}</p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
