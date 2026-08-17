# Sport Is For Everyone — Comprehensive Rebuild Blueprint

**Status:** Planning complete. Do not start implementation until the client says **start**.  
**Date:** 17 August 2026  
**Sources studied:** live `sportisforeveryone.org`, live `earthrise.studio`, live `masindependent.com`, plus local scrapes in this folder.

This document is the memory for the rebuild. Every later phase must follow it. Words and images on the public site come from Sport Is For Everyone unless a gap truly requires a new asset.

---

## 1. What we are building

A **dynamic, cinematic, CMS-driven** platform that keeps the SIFE brand alive while replacing the current Squarespace site with:

- a public frontend that feels alive (Earthrise-level motion)
- editorial storytelling that is scannable and magazine-like (más.independent article craft)
- an admin panel where editors control **everything that appears on the frontend**
- a real backend (database, media, forms, publishing workflow)

SIFE is not a generic sports NGO site. It is a **curatorial / cultural platform** about who sport is truly for. The new site must feel like a film studio + journal + living grassroots map — not a brochure.

**North-star line (keep verbatim):**

> MAKING SPORT SOCIALLY, CULTURALLY & STRUCTURALLY FOR EVERYONE

**Mission (keep verbatim):**

Sport Is For Everyone is a transdisciplinary platform exploring the cultural, social and structural conditions that shape who sport is truly for. It is a curatorial project and global cultural platform exploring sport as a social, cultural, and political space.

---

## 2. Research synthesis

### 2.1 Current SIFE (keep this DNA)

Live site: [https://sportisforeveryone.org/](https://sportisforeveryone.org/)  
Local scrape: `sportisforeveryone.org-1786532313566 (1)/`

**What works and must survive**

- Lime emblem as the brand mark (`EmblemLime.png`, also `emblemBlue.png`)
- Color world: lime, navy, coral, cream, black
- Typeface: **Archivo**
- Voice: precise, political, warm, not corporate
- Information architecture: Watch / Read / Events / About + Database CTA
- Founder story of **Oumou Aidara**
- Framework: **Embodiment / Inclusion / Relationality**
- Independent, donation-supported, bilingual (English / Deutsch via Weglot today)
- Berlin + “The Internet, Earth”
- Accessibility widget is present today; the rebuild must be accessible by design, not as a plugin afterthought

**What is weak and must be replaced**

- Squarespace grid feels static; hero image + overlay text is not cinematic
- Carousels hide content
- Article/interview presentation is thin compared with más.independent
- Database is a custom embed with a loading state; it should be first-class product
- Education and Where She Stands and Field Interviews are mostly empty — the *system* must make publishing them easy
- Motion is almost absent except basic Squarespace effects
- Admin is Squarespace, not a purpose-built editorial desk

**Current navigation**

```
Watch
  Films
  Field Interview
Read
  Stories across borders
  Where She Stands
  Education
Events
About
  About
  Work with Us
  Join the Database
CTA: Database
Language: English / Deutsch
```

**Footer**

- Logo + tagline “Making sport culturally, socially & structurally for everyone”
- Links: Films, Interviews, Database, About
- Location: Berlin, Germany / The Internet, Earth
- Contact: Hi@sportisforeveryone.org
- Social: Instagram `instagram.com/sportisforevery1`, YouTube `@SportisforEvery1`
- Impressum
- © All Rights Reserved, 2026 SPORT IS FOR EVERYONE

### 2.2 Earthrise Studio (motion language — steal the *feeling*, not the brand)

Live: [https://www.earthrise.studio/](https://www.earthrise.studio/)  
Local scrape: `earthrise.studio-1786965222830 (1)/`

Earthrise is a social-first climate / documentary studio. SIFE is not Earthrise. We take **craft**, not copy.

**Motion and UX patterns to translate**

| Pattern | How SIFE uses it |
|---|---|
| Full-bleed hero video with mute / play overlay | Home hero: existing SIFE photography/film, not Earthrise footage |
| Custom cursor + “View / Drag” states | Optional desktop-only; disable on touch and if `prefers-reduced-motion` |
| Split display headline with circular image inserts | Home headline around the lime emblem and athlete stills |
| Scroll-triggered navbar hide/show (`will-change: transform`) | Same behavior, SIFE navy/lime treatment |
| Hover underlines that grow from 0% width | Nav, Read more, footer links |
| Fluid `html { font-size: calc(...vw) }` type scaling | Display headlines that scale with viewport |
| Featured project cards with hover scale + arrow | Films, interviews, stories, events |
| Marquee of repeating manifesto line | “This is media for the future” → SIFE’s manifesto line |
| Lazy-loaded video via IntersectionObserver | Films page and home |
| Flickity / drag carousels | Use sparingly; prefer editorial lists for stories |
| Page-wrapper + cinematic section rhythm | Dark/light section alternating with lime accents |
| Newsletter + contact in footer | Keep SIFE contact + optional mailing list later |

**Do not copy**

- Earthrise logo, copy, colors, clients, Cousteau quote, London address
- Their exact Webflow class names or layout 1:1
- Custom cursor on mobile

### 2.3 más.independent (editorial presentation — steal the *reading system*)

Live: [https://masindependent.com/](https://masindependent.com/)  
Local scrape: `masindependent.com-1786964714292/`  
User screenshots: podcast list, journal list, homepage sidebar grid

más.independent is a running journal + shop. SIFE is not a shop. We take **how stories are presented**.

**Article UX patterns to translate**

1. **Asymmetric home grid**
   - One large featured story (image + all-caps headline + Read more)
   - Side column of smaller cards (category, thumbnail, truncated title)
2. **Latest list (journal / podcast)**
   - Small category label (`Event`, `Podcast`, `Journal`)
   - Bold all-caps title
   - 2–3 line excerpt
   - Underlined `Read more` / `Weiterlesen`
   - Landscape image on the right
   - Huge whitespace, no card borders, no drop shadows
3. **Section label + display title**
   - Tiny `Journal` above `DIE NEUSTEN ARTIKEL` / `THE LATEST EPISODES`
4. **Detail page**
   - Full-bleed or large header image
   - Category + date
   - Long-form body, generous measure (~65–72ch)
   - Related stories at the bottom
5. **Home manifesto strip**
   - “Running deserves more” marquee → SIFE marquee with the manifesto line
6. **High-contrast photography** carrying color; UI stays monochrome plus brand accents

**Do not copy**

- más.independent articles, product shop, podcast guests, German running-scene copy
- Their exact Inter-only look if it fights Archivo (SIFE keeps Archivo; we can add a display companion)

**SIFE mapping**

| más.independent | SIFE |
|---|---|
| Journal | Stories across borders + Where She Stands + Education |
| Podcast list | Field Interviews + Films archive |
| Featured hero story | Latest film or story |
| Shop | Not in v1 (donations only) |
| Our Race | Events |
| About | About + Work with us |

---

## 3. Brand system (keep alive)

### 3.1 Name and lockup

- Full name: **Sport Is For Everyone**
- Short: **SIFE**
- Logo: lime emblem (`EmblemLime.png`) on dark; blue emblem (`emblemBlue.png`) on light
- Alt text always: `Sport is for Everyone`
- Favicon from existing `favicon.ico`

Never redraw the emblem. Recolor only if we already have an official variant.

### 3.2 Color tokens

Extracted from live Squarespace CSS variables:

| Token | HSL | Approx hex | Use |
|---|---|---|---|
| `sife-lime` | `76.55 50% 77.25%` | `#D2E2A8` | Emblem field, highlights, hover, section fills |
| `sife-cream` | `60 56.52% 95.49%` | `#FAFAED` | Light page backgrounds, article paper |
| `sife-coral` | `0.88 58.12% 54.12%` | `#CE4846` | Accent CTAs, required emphasis, “Join” |
| `sife-navy` | `231.7 44.76% 41.18%` | `#3A4798` | Headers on lime, framework labels, links on light |
| `sife-black` | `0 0% 0%` | `#0A0A0A` | Cinematic sections, type on lime |
| `sife-white` | — | `#FFFFFF` | Type on navy/black photography |
| `sife-ink` | — | `#111111` | Body text on cream |

**Theme rules**

- Home and Watch: mostly **black + photography + lime type**
- Read / article interiors: **cream paper + black type + navy labels** (más.independent lesson)
- Database: **cream + navy filters + lime selected chips**
- Admin: functional, not cinematic — cream/navy, no custom cursor

### 3.3 Typography

- **UI + body:** Archivo (current brand)
- **Display (optional companion):** a tightly tracked grotesque for huge all-caps headlines, still in the Archivo family first (`Archivo` 600–800). Only add a second family if Archivo cannot deliver the Earthrise display scale.
- Headlines: often uppercase, tight tracking, large fluid size
- Body: sentence case, 1.5–1.7 line height, max ~68ch
- Labels: 0.75–0.85rem, letter-spacing ~0.08em, uppercase or small bold (`Event`, `Film`, `Interview`)

### 3.4 Voice

Keep existing words. Do not rewrite into charity-speak.

- “Find the spaces that were built for you. Not the other way around.”
- “Unscripted conversations / anyone, anywhere, as long as sport is part of the story.”
- “Stories by Women, for Women”
- “An ongoing archive of films that move literally and metaphorically”
- “This platform is independent. Your support keeps it free, accessible, and ours.”

If a new UI string is needed (filters, pagination, admin), write it in the same register: short, concrete, no slogans that are not already SIFE.

### 3.5 Motion principles (Earthrise → SIFE)

1. **Cinematic, not busy.** One hero motion at a time.
2. **Scroll is the director.** Lenis smooth scroll + GSAP ScrollTrigger.
3. **Images do the color.** UI stays lime/navy/coral.
4. **Respect reduced motion.** Instant states, no cursor, no marquee.
5. **Touch first.** No custom cursor, larger hit areas, no drag-only UI.
6. **Page transitions** are fades/slides of 400–700ms, not loaders that hide content.
7. **Hover is extra, never required** to understand a card.

---

## 4. Information architecture

Public routes (English). German uses the same paths with `locale` prefix `/de/...`.

| Route | Page | Admin-managed? |
|---|---|---|
| `/` | Home | Yes — featured items, hero media, manifesto |
| `/films` | Films archive | Yes — Film collection |
| `/films/[slug]` | Film detail | Yes |
| `/interviews` | Field Interviews index | Yes — Interview collection |
| `/interviews/[slug]` | Interview article | Yes |
| `/stories` | Stories across borders | Yes — Story collection (series: Dakar, Iten…) |
| `/stories/[slug]` | Story article | Yes |
| `/where-she-stands` | Where She Stands | Yes — tagged stories |
| `/education` | Education | Yes — Resource collection (can be “coming soon”) |
| `/events` | Events | Yes — Event collection |
| `/events/[slug]` | Event detail | Yes |
| `/database` | Grassroots database | Yes — Project collection + tags |
| `/join` | Join the database form | Form → admin review queue |
| `/about` | About | Yes — pages + founder block |
| `/work-with-us` | Work with us | Yes |
| `/contact` | Contact (can live on About) | Form |
| `/impressum` | Legal | Yes — legal page |
| `/privacy` | Privacy | Yes |
| `/donate` | Support | Stripe later; copy from About today |

Admin:

| Route | Purpose |
|---|---|
| `/admin` | Payload CMS (or custom admin) |
| collections listed in §7 | CRUD, media, publish, reorder |

---

## 5. Page-by-page design

### 5.1 Home — cinematic studio

**Feel:** Earthrise home, SIFE brand.

1. **Preloader (optional, short):** lime emblem scale-in, then reveal.
2. **Hero:** full-viewport still or muted loop from existing photography (`IMG_1335.png` and film stills). Overlay:

   `MAKING SPORT SOCIALLY, CULTURALLY & STRUCTURALLY FOR EVERYONE`

   Scroll cue (animated arrow, Earthrise-style).
3. **Manifesto marquee** on lime or black: repeating manifesto line.
4. **Three portals** (not a carousel — a horizontal editorial row that becomes a stack on mobile):

   - Films & Field Interviews — “Stories from athletes, artists and communities redefining sport” — WATCH
   - Stories Across Borders — “Research, essays and field notes from around the world” — READ
   - Explore the Network — “Find grassroots projects and initiatives around the world” — DATABASE
5. **Latest editorial strip** (más.independent “latest articles”):
   - Section label `Watch` / `Read`
   - Display title `THE LATEST STORIES`
   - 3 rows: category, title, excerpt, Read more, image right
6. **Featured film** (large asymmetric block): Ode to Friendship or whatever is marked featured in CMS.
7. **Network CTA:** “Are you part of a grassroots initiative?” + “Add your project…” + Join the network.
8. **Previous events** as compact editorial cards.
9. Footer.

### 5.2 Films — archive that feels like a screening room

Hero: `Films & Visual Stories` + existing subtitle.

Then a **featured short** (Ode to Friendship) as a large player.

Then a más.independent-style list for the rest:

- NEVER TOO LATE (Cape Town) — Admire Muzopambwa / warrick Creates & Team Foolhardy
- THE WORLD AROUND THE LANE LINES (Dakar) — PAUMAGAZINE Film

Detail: credits, location, runtime, embed, related films.

### 5.3 Field Interviews — journal of conversations

Hero copy kept. Index is empty today — CMS must still support full articles so Oumou can publish without a developer.

Layout: más.independent podcast list (text left, image right, Read more).

### 5.4 Stories across borders

Hero: `STORIES across borders` / `Sport, across lives and places.`

Existing volumes: **Vol. 01 — Dakar**, **Vol. 02 — Iten**. These become series + articles.

### 5.5 Where She Stands

Hero: `Where She Stands` / `Stories by Women, for Women`.  
Empty today. Same article engine, filtered by series.

### 5.6 Education

`Educational Materials` / `We're building something worth reading. Coming soon.`  
CMS resources can replace “coming soon” without a redesign.

### 5.7 Events

`UPCOMING AT SIFE` / `Come for the talks, Stay for the adventure.`  
Past: Slow Hike in Usedom, Easter Hike.

### 5.8 Database — product, not embed

Headline: `DATABASE`  
Line: `Find the spaces that were built for you. Not the other way around.`

- Search
- Tag chips (existing tags below)
- Region / country / city filters
- Cards: name, city, tags, Instagram/web
- CTA: Join the Database

**Seed projects (from live database):**

Arctic Blizzard Running Club (Tromsø); Bikeygees e.V (Berlin); Black FLINTA\* Run (Berlin); Black Women Run Berlin; Black Women Run Hamburg; Black Hike Hamburg; Chicane Bike Club (Berlin); Climb2connect (Berlin); FLINTA\* Workout Club (Berlin); Free to Run (Middle East); Queers Who Sweat (Berlin); Panther Active Universe (Zürich); Refugee Ride Collective (London); Run N Rave (Berlin); Safe Sport e.V. (Berlin); Team Shoiert (Berlin); Terranga (Berlin); The Rolling Mile (Berlin); The Mountaincamp (EU).

**Existing tags:** Asylum-seekers, BIPOC-led, Beginner, Environmental / Outdoor Focus, Free/low-cost, LGBTQIA+, Mental Health Aware, Migrant / Refugee support, Refugees, TNB+, Woman-led, Women, Youth, Black-Women.

### 5.9 Join the Database

`Let’s make sport for everyone together`  
Launch-phase copy kept. Form fields migrate from Squarespace (name, contact, project, location, links, description, tags). Submissions land in admin as **pending projects**, not live until approved.

### 5.10 About

Keep all founder copy, UNESCO stats, framework, contact form, donation module copy.

Layout: cinematic portrait of Oumou (`sport-is-for-everyone.png`) + long-form on cream, then three framework columns with lime rules.

### 5.11 Work with us

Keep accordion:

- Activations & Gatherings
- Talk & Panel
- Storytelling & Concepts

Keep How we work / Approach / Who it’s for / Context.  
Previous collaboration: Oumou x Roots (BAM 6 THE ORDINARY, Roots Berlin).

### 5.12 Impressum

Keep legal text: Oumou Aidara, Herrfurthplatz 2, 12049 Berlin, hi@oumou.de, Instagram @sportisforevery1, German TMG disclaimer.

---

## 6. Technical architecture

### 6.1 Chosen stack

| Layer | Choice | Why |
|---|---|---|
| Public site | **Next.js (App Router) + TypeScript** | SEO, locales, server components, film/story pages |
| Styling | **Tailwind CSS + CSS variables** | Brand tokens, fluid type |
| Motion | **GSAP + ScrollTrigger + Lenis** | Earthrise-grade scroll; Framer Motion only for small UI |
| CMS + Admin + API | **Payload CMS 3** | Admin UI included; TypeScript collections; drafts; media |
| Database | **PostgreSQL** | Projects, articles, users |
| Auth | Payload auth | Admin users only in v1 |
| Media | Payload uploads (local → S3/R2 later) | Films stills, emblems, portraits |
| Video | Existing hosts (Vimeo/YouTube/Squarespace embeds) | Do not re-host huge files in v1 |
| i18n | `next-intl` EN + DE | Replaces Weglot |
| Forms | Payload + server actions | Contact, join, collaborate |
| Donations | Stripe (phase 9) | Replace Squarespace donation block |
| Email | Resend or SMTP | Form notifications to Hi@sportisforeveryone.org |
| Hosting | Vercel (frontend) + managed Postgres (Neon/Railway) | Simple ops; Payload can run on the same Next app |

**Monorepo shape (single Next app is enough):**

```
/
  BLUEPRINT.md
  PLAN.md
  apps/web                 # Next.js + Payload
    src/app/(public)       # cinematic frontend
    src/app/(payload)      # /admin
    src/collections/       # CMS schema
    src/lib/motion         # GSAP/Lenis helpers
    src/styles/tokens.css
  research/                # original scrapes (local, gitignored)
  public/brand             # emblem, favicon
```

Payload 3 can live **inside** the Next.js app. That is the recommended path: one deploy, one TypeScript codebase, admin at `/admin`.

### 6.2 Why not a separate custom admin first?

A custom admin would delay the cinematic frontend. Payload gives Oumou a real desk on day one: draft/publish, media library, reorder, tags. If the admin UX later needs to be more branded, we skin Payload or replace it — the collections stay.

### 6.3 Publishing model

Every public piece of content has:

- `status`: `draft | published`
- `publishedAt`
- `featured` boolean
- `locale` fields or localized Payload fields
- SEO title/description/og image

Home does not hardcode films. It queries `featured` + latest published entries.

### 6.4 Roles

| Role | Can do |
|---|---|
| Super admin | Everything |
| Editor | CRUD content, approve database submissions, upload media |
| Reviewer (optional later) | Approve projects only |

v1 can be a single admin user (Oumou).

---

## 7. Data model (admin controls the frontend)

### Collection: `pages`

Singleton-ish documents: Home, About, Work with us, Education placeholder, Impressum, Privacy.  
Fields: hero, rich text, SEO, optional gallery.

### Collection: `films`

title, slug, excerpt, location, year, runtime, credits (rich), videoUrl, poster, stills[], featured, series/tags, body.

**Seed:**

1. Ode to Friendship — Darwin FC (Berlin, Philippe Gnant, 1’28”, full credits)
2. Never Too Late (Cape Town, Admire Muzopambwa)
3. The World Around the Lane Lines (Dakar, PAUMAGAZINE)

### Collection: `interviews`

title, slug, guest, excerpt, cover, body, location, featured.  
Seed: none (empty by design, ready to publish).

### Collection: `stories`

title, slug, excerpt, cover, body, category (`borders` | `where-she-stands` | `education`), series (`dakar` | `iten` | null), featured.

### Collection: `events`

title, slug, excerpt, cover, startDate, endDate, location, status (`upcoming` | `past`), body.

**Seed:** Slow Hike in Usedom; Easter Hike.

### Collection: `projects` (database)

name, slug, city, country, region, tags[], instagram, website, description, image, status (`pending` | `published` | `rejected`).

Seed all live database rows listed in §5.8.

### Collection: `tags`

name, slug, group (`community` | `access` | `focus`).

### Collection: `people`

For credits and founder: Oumou Aidara portrait + bio.

### Collection: `collaborations`

Oumou x Roots, etc.

### Collection: `media`

Payload default.

### Collection: `forms` / `submissions`

Contact, Work with us, Join database. Stored and emailed.

### Globals: `site`

nav, footer, socials, contact email, manifesto line, default OG image (emblem).

---

## 8. Frontend component system

Build these once, reuse everywhere:

**Chrome**

- `SiteHeader` — logo left, Watch/Read/Events/About, Database coral button, language
- `SiteFooter` — four-column SIFE footer
- `CustomCursor` — desktop only, reduced-motion off
- `SmoothScroll` — Lenis provider
- `PageTransition`

**Motion primitives**

- `Reveal` — fade/up on enter
- `ParallaxMedia`
- `Marquee`
- `MagneticButton` (subtle)
- `HoverUnderline`

**Editorial (más.independent)**

- `EditorialList` — stacked rows, text + image
- `EditorialCard`
- `FeaturedHero` — large image, headline, Read more
- `CategoryLabel`
- `ArticleLayout` — cream paper, 68ch body, share, related

**Cinematic**

- `CinematicHero`
- `PortalRow` — three home portals
- `FilmPlayer`
- `FrameworkGrid` — Embodiment / Inclusion / Relationality

**Database**

- `ProjectFilters`
- `ProjectGrid`
- `TagChip`

**Forms**

- `JoinForm`, `ContactForm`, `DonateBlock`

Admin never needs these cinematic components.

---

## 9. UX rules

1. Skip link, visible focus rings (navy on cream, lime on black).
2. Keyboardable nav, filters, accordions, video.
3. Contrast: lime type on black is OK; coral text on navy is not.
4. Images always have alt text from existing alts where available.
5. Language switcher persists locale.
6. Database filters update URL query so links are shareable.
7. Empty states are designed (Interviews, Education, Where She Stands).
8. No shop, no fake products, no más.independent or Earthrise content.
9. Prefer real SIFE photos even if fewer than a typical agency site.
10. German pages: professional translation of UI chrome; body copy stays as provided (do not auto-rewrite founder text). If DE copy is missing, show EN with a small note until translated.

---

## 10. Content & asset pipeline

Scraped images were **not** saved locally (only SVG chrome). During Phase 1 we download originals from Squarespace CDN into `public/brand` and `public/seed`:

Known assets:

- `EmblemLime.png`, `emblemBlue.png`, `favicon.ico`
- Home hero `IMG_1335.png`
- Portal images: `IMG_0405.jpg` (Never Too Late / Admire), `DSC_0073.jpg` (three people jogging), database screenshot
- Event photos `IMG_0959.JPG`, `IMG_0961.JPG`
- About portrait `sport-is-for-everyone.png`
- Film posters/stills referenced on `/films`

Rule: **download, don’t hotlink**, so the new site does not depend on Squarespace.

---

## 11. What “futuristic UI + great UX” means here

Futuristic for SIFE is **not** neon cyberpunk. It is:

- fluid type
- full-bleed media
- scroll-directed storytelling
- lime emblem as a living mark (subtle float / mask)
- editorial lists that feel like a 2026 journal
- a database that feels like a tool, not a blog
- instant admin publishing

The future of this brand is **media + network**. The UI should make both feel inevitable.

---

## 12. Out of scope for v1

- Native mobile apps
- Membership / logged-in public users
- Shop / merch
- Live streaming studio
- Recreating Weglot’s full automatic translation
- Pixel-copy of Earthrise or más.independent
- Replacing Oumou’s words with generated copy

---

## 13. Success criteria

- A visitor understands the three portals in under 10 seconds.
- An editor can publish a film, interview, story, event, or database project without a developer.
- Motion feels expensive on a laptop and calm on a phone.
- Brand (emblem, lime, navy, coral, Archivo, manifesto) is unmistakable.
- Existing films, events, about copy, and database rows are all present.
- Lighthouse accessibility ≥ 90 on core pages with reduced-motion respected.
- EN/DE chrome works.

---

## 14. Execution contract

Implementation is **phase-gated**. See `PLAN.md`.

No coding of the product until the client says **start**.  
Each phase ends with a git commit. Do not skip ahead.
)
