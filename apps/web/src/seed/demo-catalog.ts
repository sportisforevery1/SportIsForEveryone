import { richText } from "./lexical";

/** Shared long-form filler so every demo entry can fill a reading layout. */
export function demoBody(topic: string, beats: string[]) {
  return richText(
    { type: "h2", text: topic },
    ...beats.flatMap((beat, index) => [
      { type: "h3" as const, text: `Note ${index + 1}` },
      beat,
    ]),
    {
      type: "ul",
      items: [
        "Seed content for layout and navigation QA",
        "Safe to edit or delete in Payload Admin",
        "Replace with consented, final copy when ready",
      ],
    },
    "Closing line for the demo article — keep scrolling to feel spacing, type, and cream-on-navy chrome.",
  );
}

type MediaKey =
  | "hero"
  | "admire"
  | "dakar"
  | "iten"
  | "slowHike"
  | "easterHike"
  | "oumou"
  | "roots";

export const demoStories: Array<{
  slug: string;
  title: string;
  excerpt: string;
  category: "borders" | "where-she-stands" | "education";
  series?: "dakar" | "iten";
  cover: MediaKey;
  featured?: boolean;
  body: ReturnType<typeof richText>;
}> = [
  {
    slug: "pitch-notes-from-nairobi",
    title: "Pitch notes from Nairobi",
    excerpt:
      "Informal football, shared balls, and what a public pitch teaches about belonging before any federation arrives.",
    category: "borders",
    cover: "hero",
    body: demoBody("Pitch notes from Nairobi", [
      "The pitch opens before the shops do. Kids arrive with mismatched boots and a ball that has already lived three lives.",
      "Coaches here measure success in whether someone comes back tomorrow, not in whether a scout notices.",
      "Borders in this story are fences, fees, and the quiet rule that some bodies are watched more than others.",
    ]),
  },
  {
    slug: "ferry-fares-and-floodlights",
    title: "Ferry fares and floodlights",
    excerpt:
      "How transport cost and night lighting decide who can train — a Borders essay built for the “more stories” rail.",
    category: "borders",
    cover: "roots",
    body: demoBody("Ferry fares and floodlights", [
      "A training plan collapses when the last ferry leaves before cool-down ends.",
      "Floodlights are not atmosphere; they are permission to stay past sunset.",
      "We follow three athletes who budget kilometres against tickets and safety.",
    ]),
  },
  {
    slug: "after-the-cameras-leave",
    title: "After the cameras leave",
    excerpt:
      "Hosting is temporary. Clubs are not. Notes on what mega-events owe the people who already organised sport.",
    category: "borders",
    cover: "dakar",
    featured: false,
    body: demoBody("After the cameras leave", [
      "Temporary venues can still leave lasting schedules — if anyone funds the caretakers.",
      "Athletes describe pride and pressure in the same sentence when the world arrives.",
      "This Borders piece asks what remains public when the broadcast trucks drive away.",
    ]),
  },
  {
    slug: "night-runs-and-streetlights",
    title: "Night runs and streetlights",
    excerpt:
      "Where She Stands: the commute home is part of the sport — safety, pace, and crews that wait at corners.",
    category: "where-she-stands",
    cover: "slowHike",
    featured: true,
    body: demoBody("Night runs and streetlights", [
      "Participation stats rarely include the walk from the track to the bus.",
      "Crews that wait change who finishes — and who starts at all.",
      "We map one neighbourhood’s lighting against who trains after work.",
    ]),
  },
  {
    slug: "coaching-without-apology",
    title: "Coaching without apology",
    excerpt:
      "Strength sessions that take women’s power seriously — and media that still treats it as a surprise.",
    category: "where-she-stands",
    cover: "oumou",
    body: demoBody("Coaching without apology", [
      "A coach stops apologising for programming heavy lifts.",
      "Athletes talk about being underestimated in the gym and over-explained in interviews.",
      "Where She Stands keeps the focus on practice, not on proving legitimacy.",
    ]),
  },
  {
    slug: "kit-bags-and-the-gaze",
    title: "Kit bags and the gaze",
    excerpt:
      "What you carry marks you. Notes on kit, visibility, and moving through the city as a woman who trains.",
    category: "where-she-stands",
    cover: "easterHike",
    body: demoBody("Kit bags and the gaze", [
      "A kit bag can read as ambition or as a target, depending on the street.",
      "Changing rooms still design for one imagined body.",
      "This essay stays with the ordinary logistics that never make highlight reels.",
    ]),
  },
  {
    slug: "academy-designing-access",
    title: "Workshop: Designing access",
    excerpt:
      "Academy module — redesign one familiar sporting space with the same budget and clearer hospitality.",
    category: "education",
    cover: "iten",
    featured: true,
    body: demoBody("Workshop: Designing access", [
      "Session outline: map a gym, park loop, or hall; name who feels welcome; change one constraint.",
      "Facilitators keep the group from rushing to branding before staffing and timing.",
      "Close with one ask participants can take to a club or city office.",
    ]),
  },
  {
    slug: "academy-reading-list-bodies",
    title: "Reading list: Bodies in motion",
    excerpt:
      "A starter Academy bibliography — essays, films, and questions for hosts building a first syllabus.",
    category: "education",
    cover: "admire",
    body: demoBody("Reading list: Bodies in motion", [
      "Pair one short film with one field interview and ask what each leaves out.",
      "Include a piece written from the Global South without framing it as exotic.",
      "Leave blank weeks so local organisers can add their own texts.",
    ]),
  },
  {
    slug: "academy-host-notes-slow-gathering",
    title: "Host notes: Slow gathering",
    excerpt:
      "How to hold a hike or walk that feels like research — silence, shared pace, and clear consent.",
    category: "education",
    cover: "slowHike",
    body: demoBody("Host notes: Slow gathering", [
      "Start with names and access needs before the first step.",
      "Build pauses into the route so conversation is optional, not forced.",
      "End with tea and one question participants can carry home.",
    ]),
  },
];

export const demoFilms: Array<{
  slug: string;
  title: string;
  excerpt: string;
  location: string;
  runtime: string;
  videoUrl: string;
  poster: MediaKey;
  credits: string;
  body: ReturnType<typeof richText>;
}> = [
  {
    slug: "shared-pace-berlin",
    title: "Shared Pace — Berlin",
    excerpt:
      "A short study of a weekend crew that waits at corners and treats the city as a commons, not a course.",
    location: "Berlin, Germany",
    runtime: "6’",
    videoUrl: "https://player.vimeo.com/video/828725300",
    poster: "hero",
    credits: "Demo seed film — replace with real embed when rights clear.",
    body: demoBody("Shared Pace — Berlin", [
      "The camera stays with the middle of the pack, where conversation happens.",
      "Street lights and shop shutters become part of the choreography.",
      "SIFE screens work that treats friendship as infrastructure.",
    ]),
  },
  {
    slug: "coastal-rest-usedom",
    title: "Coastal Rest — Usedom",
    excerpt: "Field notes from a slow hike: rest as practice, not reward.",
    location: "Usedom, Germany",
    runtime: "9’",
    videoUrl: "https://www.youtube.com/embed/sq1E73L2LOM",
    poster: "slowHike",
    credits: "Demo seed film for layout QA.",
    body: demoBody("Coastal Rest — Usedom", [
      "Sand, wind, and the decision to stop without apology.",
      "A workshop on rest that never becomes a productivity tip.",
      "Use this page to feel how a secondary film sits under the featured short.",
    ]),
  },
];

export const demoInterviews: Array<{
  slug: string;
  title: string;
  guest: string;
  excerpt: string;
  location: string;
  cover: MediaKey;
  featured?: boolean;
  body: ReturnType<typeof richText>;
}> = [
  {
    slug: "field-notes-coach-amina",
    title: "Field notes with Coach Amina",
    guest: "Amina Diallo",
    excerpt:
      "On unpaid seasons, girls’ training before school, and measuring success in who returns tomorrow.",
    location: "Dakar, Senegal",
    cover: "dakar",
    featured: true,
    body: demoBody("Field notes with Coach Amina", [
      "“A medal is nice. A player who still has a place to train next year is better.”",
      "We talk ferry schedules, shared balls, and why hosting must leave clubs standing.",
      "Demo interview — replace with a consented transcript anytime.",
    ]),
  },
  {
    slug: "field-notes-run-crew-lea",
    title: "Field notes with Lea",
    guest: "Lea Mensah",
    excerpt:
      "A Berlin run-crew organiser on lighting, waiting for stragglers, and refusing race-pace as the only metric.",
    location: "Berlin, Germany",
    cover: "roots",
    body: demoBody("Field notes with Lea", [
      "“If we only celebrate the front, we teach people they don’t belong.”",
      "The crew’s rule is simple: no one finishes alone unless they choose to.",
      "Long enough for the interview template; delete when the real cut lands.",
    ]),
  },
  {
    slug: "field-notes-physio-sam",
    title: "Field notes with Sam",
    guest: "Sam Okeke",
    excerpt:
      "Care as infrastructure — physio, rest, and the quiet labour behind ‘discipline’ narratives.",
    location: "Iten, Kenya",
    cover: "iten",
    body: demoBody("Field notes with Sam", [
      "Injury stories are usually told as personal failure. Sam tells them as logistics.",
      "Who cooks, who pays, who decides when a body must stop.",
      "Seed interview for Field Interviews index density.",
    ]),
  },
];

export const demoEvents: Array<{
  slug: string;
  title: string;
  excerpt: string;
  cover: MediaKey;
  startDate: string;
  location: string;
  timing: "past" | "upcoming";
  featured?: boolean;
  body: ReturnType<typeof richText>;
}> = [
  {
    slug: "summer-reading-circle",
    title: "Summer reading circle",
    excerpt: "An outdoor reading on sport, belonging, and care — past event for the archive rail.",
    cover: "oumou",
    startDate: "2025-08-16T16:00:00.000Z",
    location: "Berlin, Germany",
    timing: "past",
    body: demoBody("Summer reading circle", [
      "We sat with three short texts and one open question.",
      "No tickets — bring a blanket and a pen.",
      "Kept as archive seed so Previous events feels full.",
    ]),
  },
  {
    slug: "database-meetup-spring",
    title: "Database meetup — spring",
    excerpt: "Organisers from the community database meet, swap tactics, and map open questions.",
    cover: "admire",
    startDate: "2025-05-10T14:00:00.000Z",
    location: "Berlin, Germany",
    timing: "past",
    body: demoBody("Database meetup — spring", [
      "Tables by theme: access, youth, outdoor, care.",
      "One ask each organiser left with a named contact.",
      "Past seed event — delete anytime.",
    ]),
  },
  {
    slug: "academy-open-session",
    title: "Academy open session",
    excerpt:
      "A public run-through of the “Who is sport for?” module — try the session before it ships, then take the notes home.",
    cover: "iten",
    startDate: "2026-10-03T17:00:00.000Z",
    location: "Berlin, Germany",
    timing: "upcoming",
    featured: true,
    body: richText(
      { type: "h2", text: "What to expect" },
      "Ninety minutes: a short free-write, paired exchange, and a wall map of where people feel welcome — or watched — when they move.",
      "We close with one actionable ask you can take to a club, school, or city office.",
      { type: "h2", text: "Programme" },
      {
        type: "ul",
        items: [
          "17:00 — Doors, names, access check-in",
          "17:15 — Free write: who is sport for, in your week?",
          "17:35 — Pair share and themes on the wall",
          "18:10 — Designing one access change with the same budget",
          "18:35 — Closing ask + notes shared by email",
        ],
      },
      { type: "h2", text: "Practical" },
      {
        type: "ul",
        items: [
          "Sliding-scale contribution — no one turned away for lack of funds (demo policy)",
          "Step-free entrance via courtyard",
          "Bring a pen; paper provided",
          "Film clip under three minutes may be shown",
        ],
      },
      { type: "h3", text: "Who it’s for" },
      "Hosts, coaches, teachers, and anyone building a first syllabus around inclusion in sport. Seed event — reschedule or rewrite in Admin → Events.",
    ),
  },
  {
    slug: "shop-launch-evening",
    title: "Shop launch evening",
    excerpt: "Try on editions, meet the team, and talk about independence without pretending merch is a donation.",
    cover: "hero",
    startDate: "2026-09-20T18:00:00.000Z",
    location: "Berlin, Germany",
    timing: "upcoming",
    body: demoBody("Shop launch evening", [
      "Editions on rails, films on loop, tea in the corner.",
      "A short talk on why the shop funds the platform.",
      "Demo upcoming event for the homepage strip.",
    ]),
  },
];

export const demoPeople: Array<{
  slug: string;
  name: string;
  role: string;
  location: string;
  portrait: MediaKey;
  bio: ReturnType<typeof richText>;
  featured?: boolean;
}> = [
  {
    slug: "admire-muzopambwa",
    name: "Admire Muzopambwa",
    role: "Trail runner / guest",
    location: "Cape Town, South Africa",
    portrait: "admire",
    featured: true,
    bio: richText(
      "Guest voice in Never Too Late and related field notes.",
      "Seed person profile for collaborations and interview links — edit or delete in Admin → People.",
    ),
  },
  {
    slug: "amina-diallo",
    name: "Amina Diallo",
    role: "Coach / organiser",
    location: "Dakar, Senegal",
    portrait: "dakar",
    bio: richText(
      "Composite seed coach for demo interviews and collaboration credits.",
      "Replace with a real bio when consent is in place.",
    ),
  },
];

export const demoCollaborations: Array<{
  slug: string;
  title: string;
  summary: string;
  image: MediaKey;
  featured?: boolean;
  body: ReturnType<typeof richText>;
}> = [
  {
    slug: "sife-x-usedom-rest",
    title: "SIFE × Usedom Rest Lab",
    summary:
      "A coastal weekend of slow hiking and facilitated rest — demo collaboration for the About / work portfolio.",
    image: "easterHike",
    featured: true,
    body: demoBody("SIFE × Usedom Rest Lab", [
      "Partners wanted embodiment without productivity language.",
      "The programme alternated movement, silence, and shared meals.",
      "Seed collaboration — wire real partners in Admin when ready.",
    ]),
  },
  {
    slug: "sife-x-screening-room",
    title: "SIFE × Screening Room",
    summary: "A pop-up cinema night pairing shorts with open talk. Demo entry for collaboration density.",
    image: "hero",
    body: demoBody("SIFE × Screening Room", [
      "Films first, then a conversation that refused panel theatre.",
      "Sliding-scale entry; database organisers invited as guests.",
      "Delete anytime under Collaborations.",
    ]),
  },
];

export const academyPageBody = richText(
  { type: "h2", text: "Academy" },
  "Academy is where SIFE publishes courses and program info — starting with Consistency Academy, then future programs as they’re built.",
  "This page is a course + info surface: what each program is, who it’s for, and how to join when enrolment opens.",
  "Edit under Admin → Pages → Academy when real syllabus copy is ready.",
);

export const whereSheStandsPageBody = richText(
  { type: "h2", text: "Stories by women, for women" },
  "Where She Stands is not a niche corner. It is a lens on how sport distributes risk, joy, and visibility.",
  "The essays below are demo-rich so the index and article covers feel full. Swap in consented pieces when they land.",
);

export const eventsPageBody = richText(
  { type: "h2", text: "Come for the talks. Stay for the adventure." },
  "Upcoming gatherings and a living archive of past ones — screenings, walks, workshops, and meetups.",
  "Seed events fill both rails so you can judge spacing on cream and navy.",
);

export const joinPageBody = richText(
  { type: "h2", text: "Add your project" },
  "We’re in launch phase, building the first version of the platform. You’re welcome to apply to be featured in the Community Database or to contribute shared resources.",
  { type: "h3", text: "What we look for" },
  {
    type: "ul",
    items: [
      "Grassroots or community-led sporting practice",
      "A clear sense of who you welcome — and how",
      "A contact path (Instagram, site, or email)",
    ],
  },
  "Use the form on this page. Seed intro copy — rewrite freely in Admin → Pages → Join.",
);

export const interviewsPageBody = richText(
  { type: "h2", text: "Unscripted conversations" },
  "Anyone, anywhere — as long as sport is part of the story. Field Interviews gather long-form voices for the Watch lane.",
  "The list below is intentionally dense with demo guests so the index never looks empty.",
);

export const filmsPageBody = richText(
  { type: "h2", text: "Films & visual stories" },
  "Short films and field pieces that treat movement as culture. Featured work sits above; the grid holds the rest of the archive.",
  "Extra seed films exist only so the grid feels alive — delete or replace in Admin → Films.",
);

export const storiesPageBody = richText(
  { type: "h2", text: "Sport, across lives and places" },
  "Stories Across Borders opens with field volumes, then a wider set of essays. Everything below is seeded for feel — keep what you like.",
);

export const databasePageBody = richText(
  { type: "h2", text: "Find spaces built for you" },
  "The database maps grassroots projects and initiatives. Filter by place and tag, then follow the organisers outward.",
);

export const extraProjects = [
  {
    name: "Queer Climb Collective",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    tags: ["LGBTQIA+", "Beginner"],
    instagram: "https://instagram.com/sportisforevery1",
  },
  {
    name: "Lagos Evening Pitch",
    city: "Lagos",
    country: "Nigeria",
    region: "Africa",
    tags: ["Youth", "Free/low-cost"],
    website: "https://sportisforeveryone.org",
  },
  {
    name: "Cape Town Trail Care",
    city: "Cape Town",
    country: "South Africa",
    region: "Africa",
    tags: ["Mental Health Aware", "Beginner"],
    instagram: "https://instagram.com/sportisforevery1",
  },
  {
    name: "Dakar Girls Track Hour",
    city: "Dakar",
    country: "Senegal",
    region: "Africa",
    tags: ["Women", "Youth", "Free/low-cost"],
    instagram: "https://instagram.com/sportisforevery1",
  },
  {
    name: "Iten Lodging Circle",
    city: "Iten",
    country: "Kenya",
    region: "Africa",
    tags: ["Migrant / Refugee support"],
    website: "https://sportisforeveryone.org",
  },
] as const;
