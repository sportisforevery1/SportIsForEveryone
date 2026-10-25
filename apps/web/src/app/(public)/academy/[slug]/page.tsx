import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModuleList } from "@/components/academy/ModuleList";
import { UnlockForm } from "@/components/academy/UnlockForm";
import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { PageHero } from "@/components/editorial/PageHero";
import { RichText } from "@/components/editorial/RichText";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getCourseBySlug, listPublicCourses } from "@/lib/courses";

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

            <div className="mt-12">
              <UnlockForm
                slug={course.slug}
                accessHint={course.accessHint}
                forgotCodeHref={course.forgotCodeHref}
                unlocked={course.unlocked}
                loggedIn={Boolean(user)}
              />
            </div>

            <div className="mt-16">
              <CategoryLabel tone="navy">Modules</CategoryLabel>
              <h2 className="mt-3 text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em]">
                Syllabus
              </h2>
              <ModuleList courseSlug={course.slug} modules={course.modules} />
            </div>

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
