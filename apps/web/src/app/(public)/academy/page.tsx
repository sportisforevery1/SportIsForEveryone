import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { PageHero } from "@/components/editorial/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { getAcademyPageData } from "@/lib/academy";
import { listPublicCourses, type CoursePublic } from "@/lib/courses";
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
  return (
    <section className="bg-sife-cream px-4 py-14 text-sife-ink sm:px-5 sm:py-16 md:px-12 md:py-24">
      <Reveal eager>
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryLabel tone="navy">Featured program</CategoryLabel>
            <StatusPill label={course.statusLabel} />
          </div>
          <h2 className="mt-4 text-[clamp(1.85rem,4.5vw,3.25rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em]">
            {course.title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sife-ink/80">
            {course.summary}
          </p>

          <dl className="mt-10 grid gap-6 border-y border-sife-ink/15 py-8 sm:grid-cols-3">
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                Format
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase tracking-[-0.02em]">
                {course.format}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                Status
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase tracking-[-0.02em]">
                {course.statusLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
                Hosted by
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase tracking-[-0.02em]">
                {course.hostedBy}
              </dd>
            </div>
          </dl>

          <ul className="mt-8 space-y-3">
            {course.modules.slice(0, 4).map((mod) => (
              <li
                key={mod.id}
                className="flex gap-3 text-base leading-relaxed text-sife-ink/80"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-sife-coral" aria-hidden />
                <span>
                  <span className="font-semibold text-sife-ink">{mod.title}</span>
                  {" — "}
                  {mod.teaser}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 bg-sife-navy px-5 py-6 text-sife-white sm:flex-row sm:items-center sm:px-7">
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
                Enter the course
              </p>
              <p className="mt-1 text-sm leading-relaxed text-sife-white/80">
                Open the syllabus, unlock with your access code, or inquire about the next cohort.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:shrink-0">
              <Link href={`/academy/${course.slug}`} className="btn-coral text-center">
                Open {course.title}
              </Link>
              <a
                href={course.inquireHref}
                className="inline-flex items-center justify-center border border-sife-lime/50 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-sife-lime"
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
  const [tChrome, academy, courses] = await Promise.all([
    getTranslations("chrome"),
    getAcademyPageData(),
    listPublicCourses(),
  ]);

  const featured =
    courses.find((c) => c.featured) || courses.find((c) => c.slug === "consistency-academy");
  const upcoming = courses.filter((c) => !featured || c.id !== featured.id);

  return (
    <>
      <PageHero
        label={tChrome("academy")}
        heading={academy.heading}
        subheading={academy.subheading}
      />

      <section className="border-t border-sife-white/10 bg-sife-navy px-4 py-10 text-sife-white sm:px-5 md:px-12 md:py-12">
        <Reveal eager>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-sife-white/80 md:text-lg">
            {academy.intro}
          </p>
        </Reveal>
      </section>

      {featured ? (
        <FeaturedCourse course={featured} />
      ) : (
        <section className="bg-sife-cream px-4 py-14 text-sife-ink sm:px-5 md:px-12">
          <Reveal eager>
            <div className="mx-auto max-w-5xl">
              <CategoryLabel tone="navy">Featured program</CategoryLabel>
              <h2 className="mt-4 text-[clamp(1.85rem,4.5vw,3.25rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em]">
                {academy.featured.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sife-ink/80">
                {academy.featured.summary}
              </p>
              <p className="mt-8 text-sm text-sife-ink/60">
                Publish a course in Admin → Courses to replace this placeholder.
              </p>
            </div>
          </Reveal>
        </section>
      )}

      <section className="bg-sife-navy px-4 py-14 text-sife-white sm:px-5 md:px-12 md:py-20">
        <Reveal>
          <CategoryLabel>Next</CategoryLabel>
          <h2 className="sife-display mt-3">Future programs</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-sife-white/75">
            Programs we’re building after Consistency Academy — each one is a Course in the CMS
            when ready to announce.
          </p>

          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {upcoming.length > 0
              ? upcoming.map((program) => (
                  <li
                    key={program.id}
                    className="border border-sife-lime/25 px-5 py-6 sm:px-6 sm:py-8"
                  >
                    <StatusPill label={program.statusLabel} tone="lime" />
                    <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em]">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-sife-white/75 sm:text-base">
                      {program.summary}
                    </p>
                    <p className="mt-6">
                      <Link
                        href={`/academy/${program.slug}`}
                        className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral"
                      >
                        View program →
                      </Link>
                    </p>
                  </li>
                ))
              : academy.upcoming.map((program) => (
                  <li
                    key={program.id}
                    className="border border-sife-lime/25 px-5 py-6 sm:px-6 sm:py-8"
                  >
                    <StatusPill label={program.statusLabel} tone="lime" />
                    <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em]">
                      {program.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-sife-white/75 sm:text-base">
                      {program.summary}
                    </p>
                  </li>
                ))}

            <li className="flex flex-col justify-between border border-dashed border-sife-lime/30 px-5 py-6 sm:px-6 sm:py-8">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime/70">
                  Open slot
                </p>
                <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em] text-sife-white/50">
                  Your next program
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sife-white/55">
                  When a new course is ready, create it in Admin → Courses — title, dates, and how
                  to join.
                </p>
              </div>
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

      <section className="bg-sife-cream px-4 py-12 text-sife-ink sm:px-5 md:px-12 md:py-16">
        <Reveal>
          <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CategoryLabel tone="navy">Gatherings</CategoryLabel>
              <p className="mt-3 max-w-md text-base leading-relaxed text-sife-ink/75">
                Live Academy sessions and related events also appear on the Events calendar.
              </p>
            </div>
            <Link
              href="/events"
              className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral"
            >
              View events →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
