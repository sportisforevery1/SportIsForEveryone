/**
 * Upsert the SIFE super-admin and an editor.
 * Usage: ADMIN_EMAIL / ADMIN_PASSWORD required.
 * Optional: EDITOR_EMAIL (default pascagihozo@gmail.com), EDITOR_PASSWORD.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;
const editorEmail = (process.env.EDITOR_EMAIL || "pascagihozo@gmail.com").trim().toLowerCase();
const editorPassword = process.env.EDITOR_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before creating the super-admin.");
}

if (adminPassword.length < 12) {
  throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
}

if (editorPassword && editorPassword.length < 12) {
  throw new Error("EDITOR_PASSWORD must be at least 12 characters.");
}

const payload = await getPayload({ config });

async function upsertUser(input: {
  email: string;
  password?: string;
  role: "super-admin" | "editor";
  name: string;
}) {
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: input.email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "users",
      id: existing.docs[0].id,
      overrideAccess: true,
      data: {
        role: input.role,
        name: input.name,
        ...(input.password ? { password: input.password } : {}),
      },
    });
    console.log(`Updated ${input.role}: ${input.email}`);
    return;
  }

  if (!input.password) {
    throw new Error(`Set a password to create ${input.email}`);
  }

  await payload.create({
    collection: "users",
    overrideAccess: true,
    data: {
      email: input.email,
      password: input.password,
      role: input.role,
      name: input.name,
    },
  });
  console.log(`Created ${input.role}: ${input.email}`);
}

await upsertUser({
  email: adminEmail,
  password: adminPassword,
  role: "super-admin",
  name: "Super admin",
});

await upsertUser({
  email: editorEmail,
  password: editorPassword,
  role: "editor",
  name: "Editor",
});

const users = await payload.find({
  collection: "users",
  limit: 50,
  depth: 0,
  overrideAccess: true,
  select: { email: true, role: true, name: true },
});
for (const user of users.docs) {
  console.log(`- ${user.email} · ${user.role}`);
}

process.exit(0);
