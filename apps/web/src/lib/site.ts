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
      { href: "/education", label: "Education" },
    ],
  },
  events: { href: "/events", label: "Events" },
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

export const workServices = [
  {
    title: "Activations & Gatherings",
    paragraphs: ["Sport/walks, hikes, and collective formats exploring embodiment and community."],
  },
  {
    title: "Talk & Panel",
    paragraphs: [
      "Talks & Lectures — Keynotes and talks exploring sport, identity, culture and social dynamics.",
      "Panel Moderation — Research-driven moderation for conversations, panels and public programs.",
    ],
  },
  {
    title: "Storytelling & Concepts",
    paragraphs: [
      "Conversations and interviews with athletes, coaches, artists and researchers, told with depth and intention and new Story-led concepts for brands and creative projects.",
    ],
  },
] as const;

export const supportCopy = {
  heading: "This platform is independent. Your support keeps it free, accessible, and ours.",
  intro: "Your support makes it possible to:",
  items: [
    "film and edit interviews",
    "invite athletes and researchers into conversation",
    "keep the platform and database independent and accessible",
  ],
  independent: "Sport is for Everyone is an independent project built through conversations and community.",
  tax: "Sport is for Everyone is an independent project. Contributions support the production of interviews and media work and are not tax-deductible donations.",
} as const;
