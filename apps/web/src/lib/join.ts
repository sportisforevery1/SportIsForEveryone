"use server";

import { redirect } from "next/navigation";

import { slugify } from "@/fields/slug";
import { getCms } from "@/lib/cms";
import { contact } from "@/lib/site";

export type JoinState = { error: string } | null;

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function joinDatabase(_prev: JoinState, formData: FormData): Promise<JoinState> {
  if (read(formData, "company")) {
    redirect("/join?sent=1");
  }

  const name = read(formData, "name");
  const email = read(formData, "email");
  const organization = read(formData, "organization");
  const projectName = read(formData, "projectName");
  const location = read(formData, "location");
  const links = read(formData, "links");
  const message = read(formData, "message");
  const requested = formData
    .getAll("tag")
    .filter((value): value is string => typeof value === "string" && value.length > 0);

  if (!name || !email || !projectName) {
    return { error: "Please add your name, email, and project." };
  }

  if (!email.includes("@")) {
    return { error: "Please add a valid email." };
  }

  const payload = await getCms();
  const tags = requested.length
    ? await payload.find({
        collection: "tags",
        where: { slug: { in: requested } },
        limit: 50,
      })
    : { docs: [] };

  const [city, country] = splitLocation(location);
  const urls = parseUrls(links);
  const instagram = urls.find((url) => url.includes("instagram.com"));
  const website = urls.find((url) => !url.includes("instagram.com")) || (!instagram ? urls[0] : undefined);

  const project = await payload.create({
    collection: "projects",
    overrideAccess: true,
    data: {
      name: projectName,
      slug: `${slugify(projectName) || "project"}-${Date.now().toString(36)}`,
      city,
      country,
      instagram,
      website,
      description: message || undefined,
      tags: tags.docs.map((tag) => tag.id),
      status: "pending",
    },
  });

  await payload.create({
    collection: "submissions",
    overrideAccess: true,
    data: {
      type: "join-database",
      name,
      email,
      organization: organization || undefined,
      projectName,
      location: location || undefined,
      links: links || undefined,
      message: message || undefined,
      requestedTags: tags.docs.map((tag) => tag.name).join(", ") || undefined,
      relatedProject: project.id,
      status: "new",
    },
  });

  try {
    await payload.sendEmail({
      to: contact.email,
      subject: `Database request: ${projectName}`,
      html: `<p>${escapeHtml(name)} (${escapeHtml(email)}) asked to add <strong>${escapeHtml(projectName)}</strong>.</p>
<p>${escapeHtml(location)}</p>
<p>${escapeHtml(message)}</p>
<p>Status: pending. Review it in /admin.</p>`,
    });
  } catch {
    console.info(`Join request pending: ${projectName} <${email}>`);
  }

  redirect("/join?sent=1");
}

function splitLocation(location: string): [string | undefined, string | undefined] {
  if (!location) return [undefined, undefined];
  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(", ")];
  return [location, undefined];
}

function parseUrls(links: string): string[] {
  if (!links) return [];
  return links
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter((item) => /^https?:\/\//i.test(item));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
