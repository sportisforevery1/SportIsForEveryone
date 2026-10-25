export const nav = {
  watch: {
    label: "Watch",
    items: [
      { href: "/films", label: "Films" },
      { href: "/interviews", label: "Field Interview" },
    ],
  },
  read: {
    label: "Read",
    items: [
      { href: "/stories", label: "Stories across borders" },
      { href: "/where-she-stands", label: "Where She Stands" },
    ],
  },
  academy: { href: "/academy", label: "Academy" },
  events: { href: "/events", label: "Events" },
  shop: { href: "/shop", label: "Shop" },
  about: {
    label: "About",
    items: [
      { href: "/about", label: "About" },
      { href: "/work-with-us", label: "Work with Us" },
      { href: "/donate", label: "Support" },
      { href: "/join", label: "Join the Database" },
    ],
  },
  database: { href: "/database", label: "Database" },
} as const;

export const footerLinks = [
  { href: "/films", label: "Films" },
  { href: "/interviews", label: "Interviews" },
  { href: "/academy", label: "Academy" },
  { href: "/shop", label: "Shop" },
  { href: "/database", label: "Database" },
  { href: "/about", label: "About" },
  { href: "/donate", label: "Support" },
] as const;

export const socials = [
  { href: "https://instagram.com/sportisforevery1", label: "Instagram" },
  { href: "https://www.youtube.com/@SportisforEvery1", label: "YouTube" },
] as const;

export const contact = {
  email: "Hi@sportisforeveryone.org",
  locationLines: ["Berlin, Germany", "The Internet, Earth"],
};

export const manifesto =
  "Making sport culturally, socially & structurally for everyone";

export const heroManifesto =
  "Making sport socially, culturally & structurally for everyone";

export const framework = [
  {
    title: "Embodiment",
    text: "Sport as practice, discipline, endurance and collective experience.",
  },
  {
    title: "Inclusion",
    text: "Who gets to move, participate and be visible and under what conditions.",
  },
  {
    title: "Relationality",
    text: "How sport creates connections, communities and shared ways of being.",
  },
] as const;

export const workIntro =
  "Each collaboration is shaped through dialogue and grounded in SIFE’s framework. Talks, activations and story-led concepts for institutions, brands and public programs.";

export const howWeWork = [
  {
    title: "Approach",
    text: "Each collaboration is shaped through dialogue and grounded in SIFE's framework.",
  },
  {
    title: "Who it's for",
    text: "Cultural institutions, brands and creative studios, festivals and public programs, research and academic spaces.",
  },
  {
    title: "Context",
    text: "Each project responds to specific contexts, communities and questions.",
  },
  {
    title: "Framework",
    text: "Embodiment, inclusion and relationality: movement, who gets to participate, and connection.",
  },
] as const;

export const aboutCopy = {
  statement:
    "Sport Is For Everyone is a transdisciplinary platform exploring the cultural, social and structural conditions that shape who sport is truly for.",
  intro:
    "A curatorial project and global cultural platform exploring sport as a social, cultural, and political space. Through interviews, artistic research, and collaborative initiatives, the platform documents how movement, bodies, and collective practices reveal broader social dynamics.",
  founder: {
    label: "Founder & curator",
    name: "Oumou Aidara",
    image: { src: "/seed/oumou-x-roots.jpg", alt: "Oumou Aidara", width: 2267, height: 3400 },
    paragraphs: [
      "Senegalese artist, writer, and triathlete based between Berlin and Dakar. As a Black athlete navigating multiple identities across continents, Oumou experienced firsthand the barriers and exclusions that shape many sporting spaces. What began as a personal response evolved into a collective vision: transforming frustration into action.",
      "From local run crews in Nairobi to cycling collectives in Berlin, grassroots initiatives are building alternative sporting cultures grounded in solidarity, accessibility, and collective care. Sport Is For Everyone exists to connect, support, and amplify these efforts.",
    ],
  },
  stats: [
    { value: "37%", text: "of women in Europe take part in sport weekly, against 45% of men" },
    { value: "85%", text: "of adolescent girls globally do not meet recommended activity levels (UNESCO)" },
  ],
} as const;

/** Shorter Work with Us points — seed + WorkPoints. */
export const directory = [
  {
    title: "Watch",
    blurb: "Films and field interviews with athletes, artists and communities redefining sport.",
    href: "/films",
    links: [
      { href: "/films", label: "Films" },
      { href: "/interviews", label: "Field Interviews" },
    ],
    image: { src: "/seed/IMG_0405.jpg", alt: "Admire Muzopambwa in Never Too Late", width: 1165, height: 1458 },
  },
  {
    title: "Read",
    blurb: "Research, essays and field notes from around the world.",
    href: "/stories",
    links: [
      { href: "/stories", label: "Stories across borders" },
      { href: "/where-she-stands", label: "Where She Stands" },
    ],
    image: { src: "/seed/DSC_0073.jpg", alt: "Vol. 01 — Dakar", width: 2048, height: 2048 },
  },
  {
    title: "Academy",
    blurb: "Consistency Academy and future programs — course + info.",
    href: "/academy",
    links: [{ href: "/academy", label: "Consistency Academy" }],
    image: { src: "/seed/DSC08685.jpg", alt: "Vol. 02 — Iten", width: 2500, height: 1875 },
  },
  {
    title: "Events",
    blurb: "Talks, hikes and gatherings. Come for the talks, stay for the adventure.",
    href: "/events",
    links: [
      { href: "/events#upcoming", label: "Upcoming" },
      { href: "/events#past", label: "Previous" },
    ],
    image: { src: "/seed/IMG_0959.jpg", alt: "Slow hike in Usedom", width: 2500, height: 1667 },
  },
  {
    title: "Shop",
    blurb: "Running Fist editions — independent merch that funds films, interviews and the database.",
    href: "/shop",
    links: [{ href: "/shop", label: "Browse editions" }],
    image: { src: "/seed/shop/sife-ed1-tee.jpg", alt: "SIFE ED1 Tee", width: 1200, height: 1500 },
  },
  {
    title: "Database",
    blurb: "Grassroots projects and initiatives around the world.",
    href: "/database",
    links: [
      { href: "/database", label: "Explore" },
      { href: "/join", label: "Join the database" },
    ],
    image: { src: "/seed/oumou-x-roots.jpg", alt: "Community hike with Sport is for Everyone", width: 2267, height: 3400 },
  },
] as const;

export function numbered(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export const workServices = [
  {
    title: "Activations & Gatherings",
    text: "Sport walks, hikes, and collective formats exploring embodiment and community.",
    paragraphs: ["Sport walks, hikes, and collective formats exploring embodiment and community."],
    project: "Oumou × Roots",
  },
  {
    title: "Talk & Panel",
    text: "Keynotes, lectures, and research-driven moderation for public programs.",
    paragraphs: ["Keynotes, lectures, and research-driven moderation for public programs."],
    project: "Slow Hike Usedom",
  },
  {
    title: "Storytelling & Concepts",
    text: "Interviews and story-led concepts with athletes, artists, and researchers.",
    paragraphs: ["Interviews and story-led concepts with athletes, artists, and researchers."],
    project: "Never Too Late",
  },
  {
    title: "Partnerships",
    text: "Collaborations with institutions, brands, festivals, and academic spaces.",
    paragraphs: ["Collaborations with institutions, brands, festivals, and academic spaces."],
    project: "Public programs",
  },
] as const;

export const supportCopy = {
  heading: "This platform is independent. Your support keeps it free, accessible, and ours.",
  intro: "Your support makes it possible to:",
  items: [
    "film and edit interviews across cities and languages",
    "invite athletes, coaches, and researchers into conversation",
    "keep the platform, Academy notes, and database independent and accessible",
    "host gatherings — walks, screenings, and open workshops — without paywalls as the default",
    "pay editors, translators, and local organisers for labour that often goes unpaid",
  ],
  independent:
    "Sport is for Everyone is an independent project built through conversations and community. We are not a league, a brand campaign, or a content farm — we are a curatorial platform that treats sport as culture.",
  how: [
    {
      title: "Production",
      text: "Field interviews, short films, and editorial series that take time on the ground.",
    },
    {
      title: "Infrastructure",
      text: "Hosting, media storage, and the tools that keep the database and shop running.",
    },
    {
      title: "Gatherings",
      text: "Screenings, slow walks, and Academy sessions where people meet without a sales funnel.",
    },
  ],
  tax: "Sport is for Everyone is an independent project. Contributions support the production of interviews and media work and are not tax-deductible donations.",
} as const;
