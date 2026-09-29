import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";
import { numbered, workServices } from "@/lib/site";

export async function ServiceCards() {
  const t = await getTranslations("work");

  return (
    <section className="px-5 pb-20 md:px-12">
      <Reveal>
        <ul className="grid gap-6 md:grid-cols-3">
          {workServices.map((service, index) => (
            <li key={service.title} className="group relative aspect-[3/4] overflow-hidden bg-sife-black">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                width={service.image.width}
                height={service.image.height}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sife-black/90 via-sife-black/20 via-55% to-transparent" />
              <span className="absolute left-5 top-5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
                {numbered(index)}
              </span>
              <div className="absolute inset-x-5 bottom-5">
                <h3 className="text-[1.625rem] font-semibold uppercase leading-none tracking-[-0.03em]">{service.title}</h3>
                <p className="mt-2.5 text-sm leading-normal text-sife-white/85">{service.text}</p>
                <p className="mt-3 text-[0.7rem] uppercase tracking-[0.14em] text-sife-lime">
                  {t("pastProject")} · {service.project}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
