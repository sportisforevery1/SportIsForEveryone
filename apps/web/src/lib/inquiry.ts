"use server";

import { redirect } from "next/navigation";

import { getCms } from "@/lib/cms";
import { contact } from "@/lib/site";

export type InquiryState = { error: string } | null;

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  if (read(formData, "company")) {
    redirect(safePath(read(formData, "next")) + "?sent=1");
  }

  const type = read(formData, "type") === "work-with-us" ? "work-with-us" : "contact";
  const name = read(formData, "name");
  const email = read(formData, "email");
  const organization = read(formData, "organization");
  const message = read(formData, "message");
  const next = safePath(read(formData, "next"));

  if (!name || !email || !message) {
    return { error: "Please add your name, email, and a message." };
  }

  if (!email.includes("@")) {
    return { error: "Please add a valid email." };
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

  try {
    await payload.sendEmail({
      to: contact.email,
      subject: type === "work-with-us" ? `Work with us: ${name}` : `Contact: ${name}`,
      html: `<p>${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(organization)}</p><p>${escapeHtml(message)}</p>`,
    });
  } catch {
    console.info(`Inquiry (${type}): ${name} <${email}>`);
  }

  redirect(`${next}?sent=1`);
}

function safePath(value: string): string {
  if (value === "/work-with-us" || value === "/about" || value === "/donate") return value;
  return "/about";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
