import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CoursePlayer } from "@/components/academy/CoursePlayer";
import { MarkModuleOpened } from "@/components/academy/MarkModuleOpened";
import { UnlockForm } from "@/components/academy/UnlockForm";
import { RichText } from "@/components/editorial/RichText";
import { getCourseBySlug } from "@/lib/courses";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string; moduleSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, moduleSlug } = await params;
  const course = await getCourseBySlug(slug);
  const mod = course?.modules.find((m) => m.slug === moduleSlug);
  if (!course || !mod) return { title: "Academy" };
  return {
    title: `${mod.title} — ${course.title}`,
    description: mod.teaser,
  };
}

export default async function ModulePage({ params }: Props) {
  const { slug, moduleSlug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const mod = course.modules.find((m) => m.slug === moduleSlug);
  if (!mod) notFound();

  const index = course.modules.findIndex((m) => m.slug === moduleSlug);
  const prev = index > 0 ? course.modules[index - 1] : null;
  const next = index < course.modules.length - 1 ? course.modules[index + 1] : null;

  const notes = mod.locked ? (
    <div className="space-y-6">
      <div className="border border-sife-coral/40 bg-white/40 px-4 py-5 sm:px-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sife-coral">
          Locked chapter
        </p>
        <p className="mt-3 text-sm leading-relaxed text-sife-ink/80">
          {mod.unlockMode === "sequential"
            ? "Finish the previous chapters first, or unlock the course with your access code."
            : "Enter your access code to open video, stills, and notes for this chapter."}
        </p>
      </div>
      <UnlockForm
        slug={course.slug}
        accessHint={course.accessHint}
        forgotCodeHref={course.forgotCodeHref}
        unlocked={course.unlocked}
      />
    </div>
  ) : mod.body ? (
    <div className="sife-prose sife-prose-compact">
      <RichText data={mod.body as never} />
    </div>
  ) : (
    <p className="text-sm leading-relaxed text-sife-ink/70">
      Notes for this chapter will appear here once published in Admin → Courses.
    </p>
  );

  return (
    <>
      <MarkModuleOpened courseSlug={slug} moduleSlug={moduleSlug} enabled={!mod.locked} />
      <CoursePlayer
        courseTitle={course.title}
        courseSlug={course.slug}
        moduleTitle={mod.title}
        moduleTeaser={mod.teaser}
        moduleIndex={index}
        moduleCount={course.modules.length}
        estimatedMinutes={mod.estimatedMinutes}
        modules={course.modules}
        currentSlug={mod.slug}
        prev={prev}
        next={next}
        locked={mod.locked}
        hasVideo={mod.hasVideo}
        videos={mod.videos}
        images={mod.images}
        notes={notes}
      />
    </>
  );
}
