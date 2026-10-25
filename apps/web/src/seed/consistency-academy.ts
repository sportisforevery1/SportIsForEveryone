import { richText } from "./lexical";

/** Demo access code — change in Admin → Courses → Consistency Academy → Access. */
export const CONSISTENCY_ACADEMY_CODE = "SIFE-CONSIST";

export const consistencyAcademySeed = {
  title: "Consistency Academy",
  slug: "consistency-academy",
  summary:
    "A four-week course + info space for building sustainable movement habits without hustle culture — hosted by Sport is for Everyone.",
  programStatus: "open" as const,
  format: "4-week cohort · course + info",
  hostedBy: "Sport is for Everyone",
  ctaLabel: "Inquire",
  featured: true,
  accessCode: CONSISTENCY_ACADEMY_CODE,
  accessHint: "Code from your welcome email (demo: SIFE-CONSIST)",
  infoBody: richText(
    { type: "h2", text: "Who this is for" },
    "People who want steady practice over performance pressure — beginners welcome, returning movers welcome, anyone rebuilding a relationship with sport.",
    { type: "h3", text: "How it runs" },
    {
      type: "ul",
      items: [
        "Four modules over about four weeks",
        "Public teasers for every module; full bodies unlock with your access code",
        "Sequential modules open as you move through the syllabus",
        "Tied to SIFE gatherings, films, and the community database",
      ],
    },
    { type: "h3", text: "How to join" },
    "Inquire for the next cohort. When you’re enrolled, you’ll receive an access code by email. Enter it on this page to unlock module bodies on your device.",
  ),
  modules: [
    {
      title: "Arrive — who is this for?",
      slug: "arrive",
      teaser: "Framing and care over hustle — how we show up to Consistency Academy.",
      unlockMode: "always" as const,
      estimatedMinutes: 12,
      body: richText(
        { type: "h2", text: "Welcome" },
        "Consistency Academy is not a challenge. It’s a frame for practicing movement with enough structure to continue — and enough softness to stay.",
        { type: "h3", text: "Ground rules" },
        {
          type: "ul",
          items: [
            "No comparison leaderboards",
            "Rest counts as practice",
            "Share only what feels safe",
            "Ask for access support early",
          ],
        },
        "Take five minutes to write why you arrived — not a goal, a reason.",
      ),
    },
    {
      title: "Pace — designing a week",
      slug: "pace",
      teaser: "Building a sustainable week of movement that fits real life.",
      unlockMode: "with_course" as const,
      estimatedMinutes: 20,
      body: richText(
        { type: "h2", text: "Week design" },
        "Map three anchors: one short session, one longer session, one recovery ritual. Everything else is optional.",
        { type: "h3", text: "Worksheet prompts" },
        {
          type: "ul",
          items: [
            "When do you already have 20 free minutes?",
            "What blocks you on busy days?",
            "Who or what makes showing up easier?",
          ],
        },
      ),
    },
    {
      title: "Barriers — access & safety",
      slug: "barriers",
      teaser: "Naming what blocks practice — access, safety, time, and belonging.",
      unlockMode: "sequential" as const,
      estimatedMinutes: 18,
      body: richText(
        { type: "h2", text: "Name the blockers" },
        "List structural barriers (cost, travel, childcare, disability access) separately from internal ones (shame, perfectionism). Both matter; they need different tools.",
        { type: "h3", text: "Checklist" },
        {
          type: "ul",
          items: [
            "Can I get there safely after dark?",
            "Is the language / culture welcoming?",
            "Do I have a backup for low-energy days?",
          ],
        },
      ),
    },
    {
      title: "Continue — after the cohort",
      slug: "continue",
      teaser: "What stays when the course ends — ritual, community, next steps.",
      unlockMode: "sequential" as const,
      estimatedMinutes: 15,
      body: richText(
        { type: "h2", text: "Closing ritual" },
        "Pick one practice from the last four weeks that you will keep for 30 more days. Tell one person. Optional: join a SIFE gathering or add a community to the database.",
        "Thank yourself for arriving — consistency is a relationship, not a streak.",
      ),
    },
  ],
};
