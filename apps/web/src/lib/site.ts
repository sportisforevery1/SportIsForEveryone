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
