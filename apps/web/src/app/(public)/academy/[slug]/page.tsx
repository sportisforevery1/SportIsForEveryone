import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AcademyGatherings } from "@/components/academy/AcademyGatherings";
import { ModuleList } from "@/components/academy/ModuleList";
import { UnlockForm } from "@/components/academy/UnlockForm";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { PageHero } from "@/components/editorial/PageHero";
import { RichText } from "@/components/editorial/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getCourseBySlug, listPublicCourses } from "@/lib/courses";
import { listCourseAcademyEvents } from "@/lib/events";
import { isCdnMediaSrc } from "@/lib/media";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const courses = await listPublicCourses();
    return courses.map((c) => ({ slug: c.slug }));
  } catch {
    // Build must succeed even if Render Postgres is cold/unreachable.
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Academy" };
  return {
    title: course.title,
    description: course.summary,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const [course, user] = await Promise.all([getCourseBySlug(slug), getSessionUser()]);
  if (!course) notFound();

  let courseEvents: Awaited<ReturnType<typeof listCourseAcademyEvents>> = [];
  try {
    courseEvents = await listCourseAcademyEvents(course.id);
  } catch {
    courseEvents = [];
  }

  return (
    <>
      <PageHero
        label="Academy"
        heading={course.title}
        subheading={course.summary}
      />

      <section className="border-t border-sife-white/10 bg-sife-navy px-4 py-8 text-sife-white sm:px-5 md:px-12">
        <Reveal eager>
          <dl className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
                Format
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase tracking-[-0.02em]">
                {course.format}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
                Status
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase tracking-[-0.02em]">
                {course.statusLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
                Hosted by
              </dt>
              <dd className="mt-2 text-sm font-semibold uppercase tracking-[-0.02em]">
                {course.hostedBy}
              </dd>
            </div>
          </dl>
        </Reveal>
      </section>

      <section className="bg-sife-cream px-4 py-14 text-sife-ink sm:px-5 md:px-12 md:py-20">
        <Reveal eager>
          <div className="mx-auto max-w-5xl">
            <CategoryLabel tone="navy">Course + info</CategoryLabel>
            {course.infoBody ? (
              <div className="sife-prose mt-6 max-w-3xl">
                <RichText data={course.infoBody as never} />
              </div>
            ) : (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-sife-ink/80">
                {course.summary}
              </p>
            )}

            {(course.cover || course.gallery.length > 0) && (
              <div className="mt-12">
                <CategoryLabel tone="navy">Workshop photos</CategoryLabel>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {course.cover ? (
                    <li className="relative aspect-[4/3] overflow-hidden bg-sife-navy/10 sm:col-span-2 md:col-span-2">
                      <Image
                        src={course.cover.src}
                        alt={course.cover.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        unoptimized={!isCdnMediaSrc(course.cover.src)}
                      />
                    </li>
                  ) : null}
                  {course.gallery.map((item, index) => (
                    <li
                      key={`${item.image.src}-${index}`}
                      className="relative aspect-[4/3] overflow-hidden bg-sife-navy/10"
                    >
                      <Image
                        src={item.image.src}
                        alt={item.caption || item.image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={!isCdnMediaSrc(item.image.src)}
                      />
                      {item.caption ? (
                        <p className="absolute inset-x-0 bottom-0 bg-sife-navy/80 px-3 py-2 text-xs text-sife-white">
                          {item.caption}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-12">
              <UnlockForm
                slug={course.slug}
                accessHint={course.accessHint}
                forgotCodeHref={course.forgotCodeHref}
                unlocked={course.unlocked}
                loggedIn={Boolean(user)}
              />
            </div>

            {course.unlocked ? (
              <div className="mt-16">
                <CategoryLabel tone="navy">Modules</CategoryLabel>
                <h2 className="mt-3 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em]">
                  Syllabus
                </h2>
                <ModuleList courseSlug={course.slug} modules={course.modules} />
              </div>
            ) : (
              <div className="mt-16 border-t border-sife-ink/15 pt-10">
                <CategoryLabel tone="navy">Access</CategoryLabel>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-sife-ink/75">
                  Module videos and the full syllabus open after you unlock with your access code.
                  Prefer another space? Ask us about cohort options.
                </p>
              </div>
            )}

            <AcademyGatherings
              events={courseEvents}
              heading="Upcoming sessions"
              emptyHint={false}
            />

            <div className="mt-12 flex flex-col gap-4 bg-sife-navy px-5 py-6 text-sife-white sm:flex-row sm:items-center sm:px-7">
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-lime">
                  Questions
                </p>
                <p className="mt-1 text-sm leading-relaxed text-sife-white/80">
                  Ask about enrolment, codes, or when the next cohort opens.
                </p>
              </div>
              <a href={course.inquireHref} className="btn-coral w-full text-center sm:w-auto">
                {course.ctaLabel}
              </a>
            </div>

            <p className="mt-10">
              <Link
                href="/academy"
                className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral"
              >
                ← Back to Academy
              </Link>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
