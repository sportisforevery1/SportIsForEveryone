import fs from "fs";
import path from "path";

import { getPayload } from "payload";

import config from "@payload-config";
import { slugify } from "../fields/slug";
import { richText } from "./lexical";
import {
  aboutBody,
  founderBio,
  impressumBody,
  joinBody,
  laneLinesExcerpt,
  mediaFiles,
  neverTooLateExcerpt,
  odeExcerpt,
  privacyBody,
  projects,
  seedDir,
  tags,
  workWithUsBody,
} from "./content";

const seed = async () => {
  const payload = await getPayload({ config });
  const mediaIds: Record<string, number | string> = {};

  const uploadMedia = async (key: keyof typeof mediaFiles) => {
    const item = mediaFiles[key];
    const filePath = path.join(seedDir, item.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing seed file: ${filePath}`);
    }

    const existing = await payload.find({
      collection: "media",
      overrideAccess: true,
      limit: 1,
      where: { filename: { equals: item.file } },
    });

    if (existing.docs[0]) {
      mediaIds[key] = existing.docs[0].id;
      return existing.docs[0].id;
    }

    const doc = await payload.create({
      collection: "media",
      overrideAccess: true,
      data: { alt: item.alt },
      filePath,
    });
    mediaIds[key] = doc.id;
    return doc.id;
  };

  console.log("Seeding SIFE content...");

  for (const key of Object.keys(mediaFiles) as Array<keyof typeof mediaFiles>) {
    await uploadMedia(key);
    console.log(`Media: ${mediaFiles[key].file}`);
  }

  const upsert = async (
    collection: "pages" | "films" | "stories" | "events" | "projects" | "tags" | "people" | "collaborations",
    slug: string,
    data: Record<string, unknown>,
    options: { drafts?: boolean } = { drafts: true },
  ) => {
    const existing = await payload.find({
      collection,
      overrideAccess: true,
      limit: 1,
      where: { slug: { equals: slug } },
    });

    const payloadData =
      options.drafts === false
        ? { ...data, slug }
        : {
            ...data,
            slug,
            _status: "published",
            publishedAt: new Date().toISOString(),
          };

    if (existing.docs[0]) {
      return payload.update({
        collection,
        id: existing.docs[0].id,
        overrideAccess: true,
        draft: false,
        data: payloadData,
      });
    }

    return payload.create({
      collection,
      overrideAccess: true,
      draft: false,
      data: payloadData,
    });
  };

  const tagIds: Record<string, number | string> = {};
  for (const tag of tags) {
    const slug = slugify(tag.name);
    const doc = await upsert(
      "tags",
      slug,
      {
        name: tag.name,
        group: tag.group,
      },
      { drafts: false },
    );
    tagIds[tag.name] = doc.id;
  }

  const oumou = await upsert("people", "oumou-aidara", {
    name: "Oumou Aidara",
    role: "Founder & curator",
    location: "Berlin / Dakar",
    portrait: mediaIds.oumou,
    bio: founderBio,
    featured: true,
  });

  await upsert("films", "ode-to-friendship-darwin-fc", {
    title: "Ode to Friendship - Darwin FC",
    excerpt: odeExcerpt,
    location: "Berlin, Germany",
    runtime: "1’28”",
    videoUrl: "https://player.vimeo.com/video/828725300",
    featured: true,
    credits: richText(
      "Directed by Philippe Gnant · Germany · 1’28”",
      "Director & Editor Philippe Gnannt - DOP Peter Garajszki - 1st AC Joko Neumann - Colorist Benjamin Packer - Copywriting Gabriella Seemann Voice-Over Oumou Aidara - Sound Design Linus Klähn - Support Kilian Depuhl & Giacomo Donati",
    ),
    body: richText(odeExcerpt),
  });

  await upsert("films", "never-too-late", {
    title: "Never Too Late",
    excerpt: neverTooLateExcerpt,
    location: "Cape Town, South Africa",
    year: 2025,
    videoUrl: "https://www.youtube.com/embed/sq1E73L2LOM",
    poster: mediaIds.admire,
    featured: false,
    credits: richText("A film by warrick Creates & Team Foolhardy"),
    body: richText(neverTooLateExcerpt),
  });

  await upsert("films", "the-world-around-the-lane-lines", {
    title: "The World Around the Lane Lines",
    excerpt: laneLinesExcerpt,
    location: "Dakar, Senegal",
    videoUrl: "https://www.youtube.com/embed/8B0yWIfuhyY",
    featured: false,
    credits: richText("A PAUMAGAZINE Film"),
    body: richText(laneLinesExcerpt),
  });

  await upsert("stories", "vol-01-dakar", {
    title: "Vol. 01 — Dakar",
    excerpt: "Sport, across lives and places.",
    category: "borders",
    series: "dakar",
    cover: mediaIds.dakar,
    featured: true,
    body: richText("Sport, across lives and places."),
  });

  await upsert("stories", "vol-02-iten", {
    title: "Vol. 02 — Iten",
    excerpt: "Sport, across lives and places.",
    category: "borders",
    series: "iten",
    cover: mediaIds.iten,
    featured: false,
    body: richText("Sport, across lives and places."),
  });

  await upsert("events", "slow-hike-in-usedom", {
    title: "Slow Hike in Usedom",
    excerpt:
      "A coastal gathering for movement and collective experience. The day includes a slow hike and a beach-based workshop exploring rest, creating space for stillness, reflection and shared presence.",
    cover: mediaIds.slowHike,
    startDate: "2026-04-04T10:00:00.000Z",
    location: "Usedom, Germany",
    timing: "past",
    featured: true,
    body: richText(
      "A coastal gathering for movement and collective experience.",
      "The day includes a slow hike and a beach-based workshop exploring rest, creating space for stillness, reflection and shared presence.",
    ),
  });

  await upsert("events", "easter-hike", {
    title: "Easter Hike",
    excerpt: "Usedom",
    cover: mediaIds.easterHike,
    startDate: "2026-04-05T10:00:00.000Z",
    location: "Usedom, Germany",
    timing: "past",
    featured: false,
    body: richText("Usedom"),
  });

  for (const project of projects) {
    await upsert(
      "projects",
      slugify(project.name),
      {
        name: project.name,
        city: project.city || undefined,
        country: project.country || undefined,
        region: project.region,
        instagram: project.instagram,
        website: project.website,
        status: "published",
        featured: project.name === "Arctic Blizzard Running Club",
        tags: project.tags.map((name) => tagIds[name]).filter(Boolean),
      },
      { drafts: false },
    );
  }

  await upsert("collaborations", "oumou-x-roots", {
    title: "Oumou x Roots",
    summary:
      "Hike centered on embodiment, alternating between collective movement, silence and guided introspection. - Led by Oumou and co-created with Roots Berlin for BAM 6 THE ORDINARY.",
    image: mediaIds.roots,
    partners: [oumou.id],
    featured: true,
    body: richText(
      "Hike centered on embodiment, alternating between collective movement, silence and guided introspection. - Led by Oumou and co-created with Roots Berlin for BAM 6 THE ORDINARY.",
    ),
  });

  await upsert("pages", "home", {
    title: "Home",
    hero: {
      heading: "Making sport socially, culturally & structurally for everyone",
      media: mediaIds.hero,
    },
    featured: true,
    body: richText(
      "Films & Field Interviews — Stories from athletes, artists and communities redefining sport",
      "Stories Across Borders — Research, essays and field notes from around the world",
      "Explore the Network — Find grassroots projects and initiatives around the world",
      "Are you part of a grassroots initiative?",
      "Add your project to the global database and connect with the community",
    ),
  });

  await upsert("pages", "about", {
    title: "About",
    hero: {
      heading: "About",
      media: mediaIds.oumou,
    },
    body: aboutBody,
  });

  await upsert("pages", "work-with-us", {
    title: "Work with us",
    hero: { heading: "Work with US" },
    body: workWithUsBody,
  });

  await upsert("pages", "impressum", {
    title: "Impressum",
    hero: { heading: "Impressum" },
    body: impressumBody,
  });

  await upsert("pages", "privacy", {
    title: "Privacy",
    hero: { heading: "Datenschutzerklärung" },
    body: privacyBody,
  });

  await upsert("pages", "join", {
    title: "Join the Database",
    hero: {
      heading: "Let’s make sport for everyone together",
      subheading:
        "We’re in our launch phase right now, building the first version of our platform.",
    },
    body: joinBody,
  });

  await upsert("pages", "education", {
    title: "Education",
    hero: {
      heading: "Educational Materials",
      subheading: "We're building something worth reading. Coming soon.",
    },
    body: richText("We're building something worth reading. Coming soon."),
  });

  await upsert("pages", "interviews", {
    title: "Field Interviews",
    hero: {
      heading: "Field Interviews",
      subheading: "Unscripted conversations / anyone, anywhere, as long as sport is part of the story.",
    },
    body: richText("Unscripted conversations", "anyone, anywhere, as long as sport is part of the story."),
  });

  await upsert("pages", "where-she-stands", {
    title: "Where She Stands",
    hero: {
      heading: "Where She Stands",
      subheading: "Stories by Women, for Women",
    },
    body: richText("Stories by Women, for Women"),
  });

  await upsert("pages", "events", {
    title: "Events",
    hero: {
      heading: "UPCOMING AT SIFE",
      subheading: "Come for the talks, Stay for the adventure.",
    },
    body: richText("Come for the talks, Stay for the adventure."),
  });

  await payload.updateGlobal({
    slug: "site",
    overrideAccess: true,
    data: {
      heroManifesto: "Making sport socially, culturally & structurally for everyone",
      manifesto: "Making sport culturally, socially & structurally for everyone",
      contactEmail: "Hi@sportisforeveryone.org",
      instagramUrl: "https://instagram.com/sportisforevery1",
      youtubeUrl: "https://www.youtube.com/@SportisforEvery1",
      defaultOgImage: mediaIds.emblemLime,
      locationLines: [{ line: "Berlin, Germany" }, { line: "The Internet, Earth" }],
      footerLinks: [
        { label: "Films", href: "/films" },
        { label: "Interviews", href: "/interviews" },
        { label: "Database", href: "/database" },
        { label: "About", href: "/about" },
        { label: "Support", href: "/donate" },
      ],
      nav: [
        {
          label: "Watch",
          children: [
            { label: "Films", href: "/films" },
            { label: "Field Interview", href: "/interviews" },
          ],
        },
        {
          label: "Read",
          children: [
            { label: "Stories across borders", href: "/stories" },
            { label: "Where She Stands", href: "/where-she-stands" },
            { label: "Education", href: "/education" },
          ],
        },
        { label: "Events", href: "/events" },
        {
          label: "About",
          children: [
            { label: "About", href: "/about" },
            { label: "Work with Us", href: "/work-with-us" },
            { label: "Support", href: "/donate" },
            { label: "Join the Database", href: "/join" },
          ],
        },
        { label: "Database", href: "/database" },
      ],
    },
  });

  console.log("SIFE seed complete.");
};

try {
  await seed();
} catch (error) {
  console.error(error);
  process.exit(1);
}
