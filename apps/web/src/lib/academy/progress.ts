import { getCms } from "@/lib/cms";

export async function listOpenedModuleSlugs(
  userId: string | number,
  courseId: string | number,
): Promise<string[]> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "course-progress",
    where: {
      and: [{ user: { equals: userId } }, { course: { equals: courseId } }],
    },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs.map((doc) => doc.moduleSlug).filter(Boolean);
}

export async function recordModuleOpened(opts: {
  userId: string | number;
  courseId: string | number;
  moduleSlug: string;
}): Promise<void> {
  const payload = await getCms();
  const existing = await payload.find({
    collection: "course-progress",
    where: {
      and: [
        { user: { equals: opts.userId } },
        { course: { equals: opts.courseId } },
        { moduleSlug: { equals: opts.moduleSlug } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (existing.docs[0]) return;

  await payload.create({
    collection: "course-progress",
    overrideAccess: true,
    data: {
      user: Number(opts.userId),
      course: Number(opts.courseId),
      moduleSlug: opts.moduleSlug,
      openedAt: new Date().toISOString(),
    },
  });
}
