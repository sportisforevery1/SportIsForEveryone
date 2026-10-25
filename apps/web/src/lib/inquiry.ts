"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getCms } from "@/lib/cms";
import { withLocale } from "@/i18n/path";

export type InquiryState = { error: "errorRequired" | "errorEmail" } | null;

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const locale = await getLocale();
  if (read(formData, "company")) {
    redirect(`${withLocale(safePath(read(formData, "next")), locale)}?sent=1`);
  }

  const type = read(formData, "type") === "work-with-us" ? "work-with-us" : "contact";
  const name = read(formData, "name");
  const email = read(formData, "email");
  const organization = read(formData, "organization");
  const message = read(formData, "message");
  const next = safePath(read(formData, "next"));

  if (!name || !email || !message) {
    return { error: "errorRequired" };
  }

  if (!email.includes("@")) {
    return { error: "errorEmail" };
  }

  const payload = await getCms();

  await payload.create({
    collection: "submissions",
    overrideAccess: true,
    data: {
      type,
      name,
      email,
      organization: organization || undefined,
      message,
      status: "new",
    },
  });

  console.info(`Inquiry (${type}): ${name} <${email}>`);
  redirect(`${withLocale(next, locale)}?sent=1`);
}

function safePath(value: string): string {
  if (value === "/work-with-us" || value === "/about" || value === "/donate") return value;
  return "/about";
}
