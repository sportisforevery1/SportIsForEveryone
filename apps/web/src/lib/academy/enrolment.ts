import { getCms } from "@/lib/cms";
import type { User } from "@/payload-types";

export async function linkEnrolmentsForEmail(
  email: string,
  userId: string | number,
): Promise<void> {
  const payload = await getCms();
  const result = await payload.find({
    collection: "course-enrolments",
    where: {
      and: [{ email: { equals: email.toLowerCase() } }, { user: { exists: false } }],
    },
    limit: 50,
    depth: 0,
    overrideAccess: true,
  });

  await Promise.all(
    result.docs.map((doc) =>
      payload.update({
        collection: "course-enrolments",
        id: doc.id,
        overrideAccess: true,
        data: {
          user: Number(userId),
          ...(doc.status === "invited" ? { status: "active" as const } : {}),
        },
      }),
    ),
  );
}

export async function getActiveEnrolment(
  userId: string | number,
  courseId: string | number,
) {
  const payload = await getCms();
  const result = await payload.find({
    collection: "course-enrolments",
    where: {
      and: [
        { user: { equals: userId } },
        { course: { equals: courseId } },
        { status: { equals: "active" } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs[0] ?? null;
}

export async function upsertCodeEnrolment(opts: {
  user: User;
  courseId: string | number;
  code: string;
}): Promise<void> {
  const payload = await getCms();
  const email = opts.user.email.toLowerCase();
  const existing = await payload.find({
    collection: "course-enrolments",
    where: {
      and: [{ course: { equals: opts.courseId } }, { email: { equals: email } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "course-enrolments",
      id: existing.docs[0].id,
      overrideAccess: true,
      data: {
        user: opts.user.id,
        status: "active",
        source: "code",
        accessCode: opts.code,
        enrolledAt: new Date().toISOString(),
      },
    });
    return;
  }

  await payload.create({
    collection: "course-enrolments",
    overrideAccess: true,
    data: {
      email,
      user: opts.user.id,
      course: Number(opts.courseId),
      status: "active",
      source: "code",
      accessCode: opts.code,
      enrolledAt: new Date().toISOString(),
    },
  });
}

export async function listActiveCoursesForUser(userId: string | number) {
  const payload = await getCms();
  const result = await payload.find({
    collection: "course-enrolments",
    where: {
      and: [{ user: { equals: userId } }, { status: { equals: "active" } }],
    },
    limit: 50,
    depth: 1,
    overrideAccess: true,
  });
  return result.docs;
}
