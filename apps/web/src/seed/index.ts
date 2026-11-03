import fs from "fs";
import path from "path";

import { getPayload } from "payload";

import config from "@payload-config";
import { slugify } from "../fields/slug";
import { aboutCopy, howWeWork, workIntro, workServices } from "../lib/site";
import { richText } from "./lexical";
import {
  aboutBody,
  dakarStoryBody,
  educationStoryBody,
  founderBio,
  impressumBody,
  interviewAdmireBody,
  interviewOumouBody,
  itenStoryBody,
  laneLinesBody,
  laneLinesExcerpt,
  mediaFiles,
  neverTooLateBody,
  neverTooLateExcerpt,
  odeExcerpt,
  odeFilmBody,
  privacyBody,
  projects,
  seedDir,
  tags,
  whereSheStandsBody,
  workWithUsBody,
} from "./content";
import {
  academyPageBody,
  databasePageBody,
  demoCollaborations,
  demoEvents,
  demoFilms,
  demoInterviews,
  demoPeople,
  demoStories,
  eventsPageBody,
  extraProjects,
  filmsPageBody,
  interviewsPageBody,
  joinPageBody,
  storiesPageBody,
  whereSheStandsPageBody,
} from "./demo-catalog";
import { consistencyAcademySeed } from "./consistency-academy";
import { seedInstagramPosts } from "./instagram";

const seed = async () => {
  const payload = await getPayload({ config });
  const mediaIds: Record<string, number | string> = {};

  const uploadMedia = async (key: keyof typeof mediaFiles) => {
    const item = mediaFiles[key];
    const filePath = path.join(seedDir, item.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing seed file: ${filePath}`);
    }

    const stem = path.basename(item.file).replace(/\.[^.]+$/, "");
    const existing = await payload.find({
      collection: "media",
      overrideAccess: true,
      limit: 1,
      where: {
        or: [
          { filename: { equals: path.basename(item.file) } },
          { filename: { equals: `${stem}.png` } },
          { filename: { equals: `${stem}.jpg` } },
          { filename: { equals: `${stem}.jpeg` } },
          { filename: { equals: `${stem}.webp` } },
        ],
      },
    });

    if (existing.docs[0]) {
      mediaIds[key] = existing.docs[0].id;
      if (item.file.startsWith("shop/")) {
        await payload.update({
          collection: "media",
          id: existing.docs[0].id,
          overrideAccess: true,
          data: { alt: item.alt },
          filePath,
        });
      }
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
    collection:
      | "pages"
      | "films"
      | "stories"
      | "interviews"
      | "events"
      | "projects"
      | "tags"
      | "people"
      | "collaborations"
      | "courses",
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
      // Force a published update so Lexical body/excerpt refresh (draft versions can leave stale public reads).
      return payload.update({
        collection,
        id: existing.docs[0].id,
        overrideAccess: true,
        draft: false,
        data: {
          ...payloadData,
          _status: "published",
          publishedAt: new Date().toISOString(),
        },
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
    body: odeFilmBody,
  });

  await upsert("films", "never-too-late", {
    title: "Never Too Late",
    excerpt: neverTooLateExcerpt,
    location: "Cape Town, South Africa",
    year: 2025,
    runtime: "18’",
    videoUrl: "https://www.youtube.com/embed/sq1E73L2LOM",
    poster: mediaIds.admire,
    featured: false,
    credits: richText("A film by warrick Creates & Team Foolhardy"),
    body: neverTooLateBody,
  });

  await upsert("films", "the-world-around-the-lane-lines", {
    title: "The World Around the Lane Lines",
    excerpt: laneLinesExcerpt,
    location: "Dakar, Senegal",
    runtime: "12’",
    videoUrl: "https://www.youtube.com/embed/8B0yWIfuhyY",
    poster: mediaIds.dakar,
    featured: false,
    credits: richText("A PAUMAGAZINE Film"),
    body: laneLinesBody,
  });

  await upsert("stories", "vol-01-dakar", {
    title: "Vol. 01 — Dakar",
    excerpt:
      "Field notes from Dakar on access, informal pitches, and what hosting the Youth Olympic Games might leave behind.",
    category: "borders",
    series: "dakar",
    cover: mediaIds.dakar,
    featured: true,
    body: dakarStoryBody,
  });

  await upsert("stories", "vol-02-iten", {
    title: "Vol. 02 — Iten",
    excerpt:
      "Altitude, expectation, and care as infrastructure in a town the world reduces for champions.",
    category: "borders",
    series: "iten",
    cover: mediaIds.iten,
    featured: false,
    body: itenStoryBody,
  });

  await upsert("stories", "where-she-stands-safety-and-pace", {
    title: "Safety, pace, and the commute home",
    excerpt:
      "A long-form Where She Stands essay on women’s sport beyond the finish line — demo seed for layout.",
    category: "where-she-stands",
    cover: mediaIds.oumou,
    featured: true,
    body: whereSheStandsBody,
  });

  await upsert("stories", "academy-who-is-sport-for", {
    title: "Workshop notes: Who is sport for?",
    excerpt:
      "A starter Academy curriculum module with session prompts — long enough to preview education layouts.",
    category: "education",
    cover: mediaIds.iten,
    featured: true,
    body: educationStoryBody,
  });

  await upsert("interviews", "field-notes-admire", {
    title: "Field notes with Admire",
    guest: "Admire Muzopambwa",
    excerpt:
      "On starting later, migration, and the community behind an ultra — a field conversation from Cape Town.",
    location: "Cape Town, South Africa",
    cover: mediaIds.admire,
    featured: true,
    body: interviewAdmireBody,
  });

  await upsert("interviews", "building-sife-with-oumou", {
    title: "Building rooms that outlive a viral moment",
    guest: "Oumou Aidara",
    person: oumou.id,
    excerpt:
      "On turning anger into structure, bilingual publishing, and what SIFE builds next.",
    location: "Berlin / Dakar",
    cover: mediaIds.oumou,
    featured: false,
    body: interviewOumouBody,
  });

  for (const story of demoStories) {
    await upsert("stories", story.slug, {
      title: story.title,
      excerpt: story.excerpt,
      category: story.category,
      ...(story.series ? { series: story.series } : {}),
      cover: mediaIds[story.cover],
      featured: story.featured ?? false,
      body: story.body,
    });
  }

  for (const film of demoFilms) {
    await upsert("films", film.slug, {
      title: film.title,
      excerpt: film.excerpt,
      location: film.location,
      runtime: film.runtime,
      videoUrl: film.videoUrl,
      poster: mediaIds[film.poster],
      featured: false,
      credits: richText(film.credits),
      body: film.body,
    });
  }

  for (const interview of demoInterviews) {
    await upsert("interviews", interview.slug, {
      title: interview.title,
      guest: interview.guest,
      excerpt: interview.excerpt,
      location: interview.location,
      cover: mediaIds[interview.cover],
      featured: interview.featured ?? false,
      body: interview.body,
    });
  }

  for (const person of demoPeople) {
    await upsert("people", person.slug, {
      name: person.name,
      role: person.role,
      location: person.location,
      portrait: mediaIds[person.portrait],
      bio: person.bio,
      featured: person.featured ?? false,
    });
  }

  for (const collab of demoCollaborations) {
    await upsert("collaborations", collab.slug, {
      title: collab.title,
      summary: collab.summary,
      image: mediaIds[collab.image],
      partners: [oumou.id],
      featured: collab.featured ?? false,
      body: collab.body,
    });
  }

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
      "Seed past event — keep for archive layout or delete in Admin → Events.",
    ),
  });

  await upsert("events", "easter-hike", {
    title: "Easter Hike",
    excerpt: "A spring gathering on Usedom for shared pace and coastal air.",
    cover: mediaIds.easterHike,
    startDate: "2026-04-05T10:00:00.000Z",
    location: "Usedom, Germany",
    timing: "past",
    featured: false,
    body: richText(
      "Easter Hike on Usedom — a past gathering kept in the archive so Previous events has real entries.",
      "Delete anytime from the CMS.",
    ),
  });

  // Do not create or overwrite upcoming demo events — editors rename/delete these in CMS.
  // Past archive seeds may still upsert for local layout QA.
  for (const event of demoEvents) {
    if (event.timing === "upcoming") {
      console.log(`Skip upcoming demo event (CMS-owned): ${event.slug}`);
      continue;
    }
    await upsert("events", event.slug, {
      title: event.title,
      excerpt: event.excerpt,
      cover: mediaIds[event.cover],
      startDate: event.startDate,
      location: event.location,
      timing: event.timing,
      featured: event.featured ?? false,
      eventType: event.eventType ?? "other",
      joinUrl: event.joinUrl,
      body: event.body,
    });
  }

  for (const project of [...projects, ...extraProjects]) {
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
    statement: aboutCopy.statement,
    lead: aboutCopy.intro,
    founder: {
      name: aboutCopy.founder.name,
      image: mediaIds.roots,
      bio: aboutCopy.founder.paragraphs.join("\n\n"),
      stats: aboutCopy.stats.map(({ value, text }) => ({ value, text })),
    },
  });

  await upsert("pages", "work-with-us", {
    title: "Work with us",
    hero: {
      heading: "Work with us",
      subheading: workIntro,
    },
    body: workWithUsBody,
    statement: workIntro,
    services: workServices.slice(0, 3).map((service, index) => ({
      title: service.title,
      text: service.text,
      project: service.project,
      image: [mediaIds.roots, mediaIds.slowHike, mediaIds.admire][index],
    })),
    steps: workServices.map(({ title, text }) => ({ title, text })),
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
        "Launch-phase applications for the Community Database and shared resources.",
    },
    body: joinPageBody,
  });

  await upsert("pages", "academy", {
    title: "Academy",
    hero: {
      heading: "Academy",
      subheading: "Consistency Academy and future programs — course + info.",
    },
    statement:
      "Academy is where SIFE turns practice into programs — starting with Consistency Academy, and growing into future courses as we build them.",
    body: academyPageBody,
    academyFeatured: {
      title: "Consistency Academy",
      status: "building",
      statusLabel: "In development",
      summary:
        "Our first Academy program — a course + info space for building sustainable movement habits without the usual performance pressure. Replace this copy with the real syllabus anytime.",
      format: "Course + info",
      hostedBy: "Sport is for Everyone",
      ctaLabel: "Inquire",
      points: [
        { text: "Course structure for steady practice over hustle culture" },
        { text: "Info hub: who it’s for, how it runs, and how to join" },
        { text: "Tied to SIFE’s wider work — films, gatherings, and the database" },
      ],
      courseBody: richText(
        { type: "h2", text: "Course overview" },
        "Paste the real Consistency Academy syllabus here in Admin → Pages → Academy → Sections → Featured course → Course body.",
        { type: "h3", text: "What belongs in this field" },
        {
          type: "ul",
          items: [
            "Who it’s for",
            "Duration / schedule",
            "What’s included",
            "How to join or pay",
          ],
        },
      ),
    },
    academyPrograms: [
      {
        title: "Future programs",
        status: "building",
        statusLabel: "Coming next",
        summary:
          "More Academy programs are being shaped. Add a new row in Admin when a course is ready to announce.",
        points: [
          { text: "Cohorts & seasonal runs" },
          { text: "Host / facilitator tracks" },
          { text: "Partner programs" },
        ],
      },
    ],
  });

  await upsert("pages", "education", {
    title: "Education",
    hero: {
      heading: "Academy",
      subheading: "Consistency Academy and future programs — course + info.",
    },
    body: academyPageBody,
  });

  await upsert("pages", "interviews", {
    title: "Field Interviews",
    hero: {
      heading: "Field Interviews",
      subheading: "Unscripted conversations — anyone, anywhere, as long as sport is part of the story.",
    },
    body: interviewsPageBody,
  });

  await upsert("pages", "where-she-stands", {
    title: "Where She Stands",
    hero: {
      heading: "Where She Stands",
      subheading: "Stories by women, for women — risk, joy, and visibility in sport.",
    },
    body: whereSheStandsPageBody,
  });

  await upsert("pages", "events", {
    title: "Events",
    hero: {
      heading: "Upcoming at SIFE",
      subheading: "Come for the talks. Stay for the adventure.",
    },
    body: eventsPageBody,
  });

  await upsert("pages", "films", {
    title: "Films",
    hero: {
      heading: "Films & visual stories",
      subheading: "Short films that treat movement as culture.",
    },
    body: filmsPageBody,
  });

  await upsert("pages", "stories", {
    title: "Stories across borders",
    hero: {
      heading: "Stories across borders",
      subheading: "Sport, across lives and places.",
    },
    body: storiesPageBody,
  });

  await upsert("pages", "database", {
    title: "Database",
    hero: {
      heading: "Database",
      subheading: "Find the spaces that were built for you. Not the other way around.",
    },
    body: databasePageBody,
  });

  const apparelSizes = ["XS", "S", "M", "L", "XL"] as const;
  const shopEditions = [
    {
      code: "SIFE ED1",
      title: "Tee",
      slug: "sife-ed1-tee",
      category: "apparel" as const,
      price: 45,
      image: mediaIds.ed1Tee,
      featured: true,
      description:
        "Heavyweight black tee. Lime Running Fist on the chest — protest, togetherness, different bodies.",
      variants: apparelSizes.map((label) => ({
        label,
        sku: `SIFE-ED1-TEE-${label}`,
        stock: 8,
      })),
    },
    {
      code: "SIFE ED2",
      title: "Hoodie",
      slug: "sife-ed2-hoodie",
      category: "apparel" as const,
      price: 85,
      image: mediaIds.ed2Hoodie,
      featured: true,
      description: "Navy hoodie, coral fist. Ready Red on Bolting Blue — the energetic duotone from the brand book.",
      variants: apparelSizes.map((label) => ({
        label,
        sku: `SIFE-ED2-HOODIE-${label}`,
        stock: 6,
      })),
    },
    {
      code: "SIFE ED3",
      title: "Cap",
      slug: "sife-ed3-cap",
      category: "accessory" as const,
      price: 32,
      image: mediaIds.ed3Cap,
      featured: false,
      description: "Structured navy cap. Lime fist on the front panel.",
      variants: [{ label: "One size", sku: "SIFE-ED3-CAP", stock: 12 }],
    },
    {
      code: "SIFE ED4",
      title: "Tote",
      slug: "sife-ed4-tote",
      category: "accessory" as const,
      price: 28,
      image: mediaIds.ed4Tote,
      featured: false,
      description: "Cream canvas tote, coral fist. Off-white and Ready Red from the brand pairs.",
      variants: [{ label: "One size", sku: "SIFE-ED4-TOTE", stock: 12 }],
    },
    {
      code: "SIFE ED5",
      title: "Print",
      slug: "sife-ed5-print",
      category: "print" as const,
      price: 22,
      image: mediaIds.ed5Print,
      featured: true,
      description: "A2-ish Running Fist print. Lime on navy. For the wall, not the wash.",
      variants: [{ label: "One size", sku: "SIFE-ED5-PRINT", stock: 15 }],
    },
    {
      code: "SIFE ED6",
      title: "Socks",
      slug: "sife-ed6-socks",
      category: "apparel" as const,
      price: 16,
      image: mediaIds.ed6Socks,
      featured: false,
      description: "Crew socks with lime heel and a small fist mark. Edition six, still for everyone.",
      variants: [
        { label: "S", sku: "SIFE-ED6-SOCKS-S", stock: 10 },
        { label: "M", sku: "SIFE-ED6-SOCKS-M", stock: 10 },
        { label: "L", sku: "SIFE-ED6-SOCKS-L", stock: 10 },
      ],
    },
  ];

  for (const edition of shopEditions) {
    const existing = await payload.find({
      collection: "products",
      overrideAccess: true,
      limit: 1,
      where: { slug: { equals: edition.slug } },
    });
    const data = { ...edition, status: "published" as const };
    if (existing.docs[0]) {
      await payload.update({
        collection: "products",
        id: existing.docs[0].id,
        overrideAccess: true,
        data,
      });
    } else {
      await payload.create({
        collection: "products",
        overrideAccess: true,
        data,
      });
    }
    console.log(`Product: ${edition.code} ${edition.title}`);
  }

  await payload.updateGlobal({
    slug: "site",
    overrideAccess: true,
    data: {
      heroManifesto: "Making sport socially, culturally & structurally for everyone",
      manifesto: "Making sport culturally, socially & structurally for everyone",
      contactEmail: "Hi@sportisforeveryone.org",
      shopPublic: false,
      instagramUrl: "https://instagram.com/sportisforevery1",
      youtubeUrl: "https://www.youtube.com/@SportisforEvery1",
      defaultOgImage: mediaIds.emblemLime,
      locationLines: [{ line: "Berlin, Germany" }, { line: "The Internet, Earth" }],
      footerLinks: [
        { label: "Films", href: "/films" },
        { label: "Interviews", href: "/interviews" },
        { label: "Shop", href: "/shop" },
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
          ],
        },
        { label: "Academy", href: "/academy" },
        { label: "Events", href: "/events" },
        { label: "Shop", href: "/shop" },
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

  const academyCourse = await upsert("courses", consistencyAcademySeed.slug, {
    ...consistencyAcademySeed,
  });
  console.log(
    `Course: ${consistencyAcademySeed.title} (code ${consistencyAcademySeed.accessCode})`,
  );

  // Link opted-in Academy gatherings after the course exists (events seed earlier).
  const academyOpen = await payload.find({
    collection: "events",
    where: { slug: { equals: "academy-open-session" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (academyOpen.docs[0] && academyCourse?.id) {
    await payload.update({
      collection: "events",
      id: academyOpen.docs[0].id,
      overrideAccess: true,
      data: {
        showOnAcademy: true,
        relatedCourse: academyCourse.id,
        joinUrl: "https://zoom.us/j/example-sife-academy",
        eventType: "open-session",
        timing: "upcoming",
      },
    });
  }

  await seedInstagramPosts(payload);

  console.log("SIFE seed complete.");
};

try {
  await seed();
} catch (error) {
  console.error(error);
  process.exit(1);
}
