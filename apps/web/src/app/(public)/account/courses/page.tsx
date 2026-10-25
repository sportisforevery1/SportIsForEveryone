import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CategoryLabel } from "@/components/editorial/CategoryLabel";
import { Link } from "@/i18n/navigation";
import { listActiveCoursesForUser } from "@/lib/academy/enrolment";
import { ensureLoggedIn } from "@/lib/auth/actions";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "My courses | Sport is for Everyone",
};

export default async function AccountCoursesPage() {
  await ensureLoggedIn("/account/courses");
  const [user, t] = await Promise.all([getSessionUser(), getTranslations("account")]);
  const enrolments = user ? await listActiveCoursesForUser(user.id) : [];

  return (
    <section className="sife-section bg-sife-cream px-5 text-sife-ink md:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="mb-6">
          <Link href="/account" className="text-xs font-bold uppercase tracking-[0.16em] text-sife-coral">
            ← {t("label")}
          </Link>
        </p>
        <CategoryLabel tone="navy">{t("myCourses")}</CategoryLabel>
        <h1 className="sife-display mt-3 text-sife-ink">{t("coursesTitle")}</h1>
        {enrolments.length === 0 ? (
          <p className="mt-8 max-w-lg text-base text-sife-ink/75">{t("coursesEmpty")}</p>
        ) : (
          <ul className="mt-10 divide-y divide-sife-ink/15 border-t border-sife-ink/15">
            {enrolments.map((row) => {
              const course = typeof row.course === "object" && row.course ? row.course : null;
              if (!course || !("slug" in course)) return null;
              return (
                <li key={row.id} className="flex flex-wrap items-end justify-between gap-4 py-6">
                  <div>
                    <h2 className="text-xl font-semibold uppercase tracking-tight">{course.title}</h2>
                    <p className="mt-2 text-sm text-sife-ink/65">{t("statusActive")}</p>
                  </div>
                  <Link href={`/academy/${course.slug}`} className="btn-coral">
                    {t("continue")}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-10">
          <Link href="/academy" className="text-xs font-bold uppercase tracking-[0.16em] text-sife-navy">
            {t("browseAcademy")} →
          </Link>
        </p>
      </div>
    </section>
  );
}
