import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { PageHero } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { AcademyGatherings } from "@/components/academy/AcademyGatherings";
import { getAcademyPageData } from "@/lib/academy";
import { listPublicCourses, type CoursePublic } from "@/lib/courses";
import { listAcademyEvents } from "@/lib/events";
import { isCdnMediaSrc } from "@/lib/media";
import { cmsPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("academy", {
    title: "Academy",
    description:
      "Consistency Academy and future SIFE programs — courses and info for moving with care.",
  });
}

function StatusPill({ label, tone = "coral" }: { label: string; tone?: "coral" | "lime" }) {
  const cls =
    tone === "lime"
      ? "border-sife-lime/50 text-sife-lime"
      : "border-sife-coral/50 text-sife-coral";
  return (
    <span
      className={`inline-flex border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${cls}`}
    >
      {label}
    </span>
  );
}

function FeaturedCourse({ course }: { course: CoursePublic }) {
  const stills = [
    ...(course.cover ? [{ image: course.cover, caption: null as string | null }] : []),
    ...course.gallery,
  ].slice(0, 4);
  const hero = stills[0] ?? null;
  const grid = stills.slice(1, 4);

  return (
    <section className="sife-section bg-sife-navy px-5 text-sife-white md:px-12">
      <Reveal eager>
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryLabel>Featured program</CategoryLabel>
            <StatusPill label={course.statusLabel} tone="lime" />
          </div>
          <h2 className="mt-4 text-[clamp(1.85rem,4.5vw,3.25rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-sife-white">
            {course.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sife-lime/90">
            {course.summary}
          </p>

          {hero ? (
            <div className="mt-10 space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-sife-true-black/30">
                <Image
                  src={hero.image.src}
                  alt={hero.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                  unoptimized={!isCdnMediaSrc(hero.image.src)}
                />
              </div>
              {grid.length > 0 ? (
                <ul className="grid grid-cols-3 gap-3">
                  {grid.map((item, index) => (
                    <li
                      key={`${item.image.src}-${index}`}
                      className="relative aspect-[4/3] overflow-hidden bg-sife-true-black/30"
                    >
                      <Image
                        src={item.image.src}
                        alt={item.caption || item.image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 33vw, 320px"
                        unoptimized={!isCdnMediaSrc(item.image.src)}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-4 border-t border-sife-lime/25 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-sife-white/70">
              Open the program page to unlock with your access code, or inquire about the next cohort.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:shrink-0">
              <Link href={`/academy/${course.slug}`} className="btn-coral text-center">
                Open {course.title}
              </Link>
              <a
                href={course.inquireHref}
                className="inline-flex items-center justify-center border border-sife-lime/40 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-sife-lime"
              >
                {course.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default async function AcademyPage() {
  const [tChrome, academy, courses, academyEvents] = await Promise.all([
    getTranslations("chrome"),
    getAcademyPageData(),
    listPublicCourses(),
    listAcademyEvents(),
  ]);

  const featured =
    courses.find((c) => c.featured) || courses.find((c) => c.slug === "consistency-academy");
  const upcoming = courses.filter((c) => !featured || c.id !== featured.id);
  const upcomingPrograms =
    upcoming.length > 0
      ? upcoming.map((program) => ({
          id: program.id,
          title: program.title,
          summary: program.summary,
          statusLabel: program.statusLabel,
          href: `/academy/${program.slug}` as const,
        }))
      : academy.upcoming.map((program) => ({
          id: program.id,
          title: program.title,
          summary: program.summary,
          statusLabel: program.statusLabel,
          href: null,
        }));

  return (
    <>
      <PageHero
        label={tChrome("academy")}
        heading={academy.heading}
        subheading={academy.subheading || academy.intro}
        compact
      />

      {featured ? (
        <FeaturedCourse course={featured} />
      ) : (
        <section className="sife-section bg-sife-navy px-5 text-sife-white md:px-12">
          <Reveal eager>
            <div className="mx-auto max-w-5xl">
              <CategoryLabel>Featured program</CategoryLabel>
              <h2 className="mt-4 text-[clamp(1.85rem,4.5vw,3.25rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em]">
                {academy.featured.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sife-lime/90">
                {academy.featured.summary}
              </p>
              <p className="mt-8">
                <Link href="/work-with-us" className="btn-coral">
                  Inquire about Academy
                </Link>
              </p>
            </div>
          </Reveal>
        </section>
      )}

      <section className="sife-section border-t border-sife-ink/10 bg-sife-cream px-5 text-sife-ink md:px-12">
        <Reveal>
          <div className="mx-auto max-w-5xl">
            {academyEvents.length > 0 ? (
              <AcademyGatherings events={academyEvents} heading="Selected gatherings" />
            ) : (
              <>
                <CategoryLabel tone="navy">Gatherings</CategoryLabel>
                <h2 className="mt-3 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em]">
                  Come together
                </h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-sife-ink/75">
                  Live sessions and opted-in Academy gatherings appear here when scheduled. Everything
                  else stays on the Events calendar.
                </p>
              </>
            )}
            <p className="mt-10">
              <Link
                href="/events"
                className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral"
              >
                Full events calendar →
              </Link>
            </p>
          </div>
        </Reveal>
      </section>

      <section className="sife-section border-t border-sife-cream/10 bg-sife-navy px-5 text-sife-white md:px-12">
        <Reveal>
          <CategoryLabel>Next</CategoryLabel>
          <h2 className="sife-display mt-3">Future programs</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-sife-white/75">
            Programs we’re building after Consistency Academy — announced here when ready to join.
          </p>

          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {upcomingPrograms.map((program) => (
              <li key={program.id} className="border-t border-sife-lime/30 pt-6">
                <StatusPill label={program.statusLabel} tone="lime" />
                <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em]">
                  {program.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sife-white/75 sm:text-base">
                  {program.summary}
                </p>
                {program.href ? (
                  <p className="mt-6">
                    <Link
                      href={program.href}
                      className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral"
                    >
                      View program →
                    </Link>
                  </p>
                ) : null}
              </li>
            ))}

            <li className="border-t border-dashed border-sife-lime/30 pt-6">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime/70">
                Partner
              </p>
              <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em] text-sife-white/70">
                Build a program with us
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-sife-white/55">
                Institutions and collectives can co-shape the next Academy format.
              </p>
              <p className="mt-8">
                <Link
                  href="/work-with-us"
                  className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral"
                >
                  Partner on a program →
                </Link>
              </p>
            </li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}
