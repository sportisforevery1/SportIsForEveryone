# Sport Is For Everyone — Phase Plan & Execution Directions

**Read `BLUEPRINT.md` first.** This file is the build order.  
**Do not implement until the client says `start`.**

After `start`, execute **one phase at a time**, commit at the end of each phase, then continue unless the client pauses.

---

## How to talk to the builder

| You say | What happens |
|---|---|
| `start` | Begin Phase 0 if git/docs need finishing, then Phase 1 |
| `start phase N` | Jump to that phase (only if earlier phases are done) |
| `pause` | Stop after the current step; commit if work is complete |
| `continue` | Next phase |
| `show preview` | Summarize how to run the local site |
| `commit` | Create a git commit for finished work (if not already) |

Each phase below has **Goal**, **Steps**, **Done when**, **Commit message intent**.

---

## Commit policy

- One commit per finished phase (more if a phase is large).
- Never commit `.env`, secrets, `node_modules`, or the raw scrape folders.
- Message style: why, not file lists. Example: `Add cinematic home shell using SIFE brand tokens.`
- Do not push unless asked.

---

## Phase 0 — Repository hygiene

**Goal:** A clean git repo that can hold the product, with research kept local.

### Steps

1. Confirm `BLUEPRINT.md` and `PLAN.md` are the source of truth.
2. Add `.gitignore` for `node_modules`, `.env*`, `.next`, Payload media cache, scrape archives.
3. Keep scrapes on disk for reference; do not commit them (too large, not the product).
4. Optional: `docs/` copies of these files later if the root gets crowded.
5. Commit docs + gitignore.

**Done when:** `git log` shows an initial commit; working tree clean except ignored scrapes.

**Commit:** `Document the SIFE rebuild blueprint and phase plan.`

---

## Phase 1 — Foundation (design system, no pages yet)

**Goal:** Next.js + Payload app boots. Brand tokens, fonts, layout chrome exist. Admin URL exists even if collections are empty.

### Steps

1. Scaffold Next.js App Router + TypeScript + Tailwind + ESLint.
2. Install Payload 3 in the same app; PostgreSQL via docker-compose or local.
3. `.env.example` with `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`.
4. CSS tokens from blueprint (`sife-lime`, `sife-navy`, `sife-coral`, `sife-cream`, `sife-black`).
5. Load **Archivo**.
6. Download brand files from Squarespace CDN into `public/brand/` (emblem lime/blue, favicon).
7. `SiteHeader` + `SiteFooter` with real SIFE nav copy and links (can be static).
8. Root layout: skip link, metadata, dark/cream backgrounds.
9. Empty `/` that only proves chrome + tokens.
10. `/admin` login works for a local admin user.

**Done when:** `npm run dev` shows header/footer in brand colors; `/admin` loads.

**Commit:** `Scaffold the Next.js and Payload foundation with SIFE brand tokens.`

---

## Phase 2 — CMS collections

**Goal:** Admin can create every content type the frontend will need.

### Steps

1. Implement collections: `films`, `interviews`, `stories`, `events`, `projects`, `tags`, `people`, `collaborations`, `pages`, `site` global, `submissions`.
2. Draft/publish, featured flags, SEO fields, media.
3. Access control: only logged-in admins write; public read published only.
4. Seed script **or** manual seed in Phase 3 — prefer a `npm run seed` in Phase 3.
5. Document in README how to log into admin.

**Done when:** An editor can click through all collections in `/admin` without errors.

**Commit:** `Add Payload collections so editors can manage every public content type.`

---

## Phase 3 — Content migration (words and images)

**Goal:** Real SIFE copy and images live in the CMS / public folder. No lorem.

### Steps

1. Download remaining Squarespace images listed in the blueprint.
2. Seed films (3), events (2), about page, work-with-us, impressum, database projects (~19), tags, founder person, Oumou x Roots collaboration.
3. Site global: emails, social URLs, manifesto, nav.
4. Verify no Earthrise or más.independent text slipped in.

**Done when:** Admin shows real titles like “Ode to Friendship - Darwin FC” and Tromsø / Berlin projects.

**Commit:** `Seed the CMS with existing SIFE copy, films, events, and database projects.`

---

## Phase 4 — Motion system

**Goal:** Reusable Earthrise-inspired motion without copying their brand.

### Steps

1. Lenis smooth scroll provider.
2. GSAP + ScrollTrigger, cleaned up on unmount.
3. `Reveal`, `Marquee`, `HoverUnderline`, `ParallaxMedia`.
4. `prefers-reduced-motion` kills smooth scroll and parallax.
5. Custom cursor **desktop only**, off by default until home is ready if it causes bugs — include but gate behind a flag.
6. Do not animate admin routes.

**Done when:** A test section on `/` reveals on scroll; reduced-motion users get a static page.

**Commit:** `Introduce GSAP and Lenis motion primitives with reduced-motion support.`

---

## Phase 5 — Home

**Goal:** Cinematic home that uses CMS data.

### Steps

1. Hero with manifesto overlay and brand photography.
2. Lime marquee.
3. Three portals (Watch / Read / Database) with existing blurbs and CTAs.
4. Latest editorial list (más.independent row pattern) from latest films/stories/interviews.
5. Featured film block.
6. Grassroots CTA.
7. Previous events.
8. Wire all buttons to real routes.

**Done when:** Home tells the SIFE story without placeholder copy.

**Commit:** `Build the cinematic home from live CMS content.`

---

## Phase 6 — Watch (Films + Interviews)

**Goal:** Screening-room films + interview journal.

### Steps

1. `/films` featured player + editorial list.
2. `/films/[slug]` credits, embed, related.
3. `/interviews` list (empty state designed).
4. `/interviews/[slug]` article layout (cream paper).

**Done when:** Ode to Friendship, Never Too Late, and Lane Lines are all reachable.

**Commit:** `Ship films and field-interview pages with editorial article layout.`

---

## Phase 7 — Read (Stories, Where She Stands, Education)

**Goal:** más.independent reading system for SIFE series.

### Steps

1. `/stories` with Vol. 01 Dakar / Vol. 02 Iten as series cards (even if body is thin).
2. `/stories/[slug]` article template.
3. `/where-she-stands` filtered index + empty state using existing hero copy.
4. `/education` coming-soon using existing sentence, ready for resources.

**Done when:** Read section matches IA; empty states are intentional, not broken.

**Commit:** `Add the stories journal, Where She Stands, and education surfaces.`

---

## Phase 8 — Events

**Goal:** Upcoming + past events from CMS.

### Steps

1. `/events` with “UPCOMING AT SIFE” and past Usedom hikes.
2. `/events/[slug]`.
3. Home previous-events already uses same collection.

**Done when:** Slow Hike and Easter Hike render with existing descriptions.

**Commit:** `Publish events as CMS-driven pages instead of static Squarespace blocks.`

---

## Phase 9 — Database + Join

**Goal:** First-class grassroots directory.

### Steps

1. `/database` search, tag chips, location filters, shareable query params.
2. Project cards with Instagram/web.
3. `/join` form → `projects.status = pending` + email notify.
4. Admin can approve to published.
5. Keep headline and tag vocabulary exactly.

**Done when:** All seeded clubs appear and a test submission shows in admin as pending.

**Commit:** `Replace the database embed with a searchable, admin-approved project directory.`

---

## Phase 10 — About, Work with us, Donate, Legal

**Goal:** Remaining IA, forms, support.

### Steps

1. `/about` full founder copy, portrait, framework, contact form, support copy.
2. `/work-with-us` accordion + collaboration.
3. Donation: Stripe Checkout **or** a clearly staged placeholder that still uses SIFE copy if keys are missing — prefer Stripe test mode.
4. `/impressum` full German legal text.
5. Privacy page stub from needed legal minimum if no existing English privacy page.

**Done when:** About reads like the current site, but laid out cinematically.

**Commit:** `Add about, collaboration, legal, and support flows from original SIFE copy.`

---

## Phase 11 — i18n, accessibility, performance, polish

**Goal:** Production-ready.

### Steps

1. `next-intl` EN/DE for chrome (nav, buttons, filters). Body from CMS locales if filled.
2. Focus, alt text, heading order, keyboard filters.
3. Image `next/image`, video lazy load.
4. SEO metadata from CMS.
5. 404 in brand.
6. README: env, seed, admin login, deploy notes.
7. Remove debug flags; cursor only on fine-pointer devices.

**Done when:** Core pages work in English, German chrome works, reduced-motion works, README is enough to run the project.

**Commit:** `Harden i18n, accessibility, and performance for launch.`

---

## Phase 12 — Deploy (only if asked)

**Goal:** Live URL.

### Steps

1. Postgres + blob storage.
2. Env on host.
3. Custom domain later; first a staging URL.
4. Redirects from old Squarespace paths if they differ.

**Do not deploy until the client asks.**

---

## Local run (after Phase 1)

```bash
cp .env.example .env
# set DATABASE_URL and PAYLOAD_SECRET
npm install
npx payload migrate
npm run dev
```

- Public: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

---

## Risk notes

- Squarespace image URLs may expire; download early in Phase 1–3.
- Film files stay as embeds; do not upload raw 4K into git.
- Database currently looks like a custom Squarespace/code embed; we reimplement, we do not scrape its private API.
- Donation is not tax-deductible — keep that sentence.
- Impressum contains a personal address — keep it, do not invent a new one.

---

## Immediate next action

Waiting for: **`start`**

On `start`, execute Phase 0 remainder (gitignore if needed) then Phase 1 without skipping.
)
