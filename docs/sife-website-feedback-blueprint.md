# SIFE website feedback blueprint

**Status:** Planning only — do not implement until the client says **start**.  
**Source:** `C:\Users\Admin\Downloads\SIFE_website.pdf` (annotated feedback on the live staging site, Sep 2026).  
**Branch for this work:** `feedback/sife-website-pdf` (forked from `origin/master`, the oldest published tip).  
**Date:** 18 September 2026  
**Companion docs:** root `BLUEPRINT.md` (original rebuild), `docs/sife-shop-blueprint.md` (shop).

This document is the memory for the feedback pass. Every later phase must follow it. It assumes the platform you already know: Next.js + Payload on Vercel, Render Postgres, Archivo, brand colours lime `#D2E2A8` / cream `#FAFAED` / coral `#CE4846` / navy `#3A4798` / black `#0A0A0A`, EN/DE chrome, CMS-driven Watch / Read / Events / Shop / About / Database.

---

## 0. Verdict first (theme / light–dark)

**The PDF is not asking to convert the whole platform from dark to light.**

What it actually says:

| Signal | Meaning |
|---|---|
| “Black theme changed to blue + green” | Try **navy + lime** surfaces in places that currently feel all-black. |
| “I really like the black here somehow” (said twice) | Keep black as the **default cinematic chrome** (header, hero, many Watch surfaces). |
| “but let’s check with blue if it’s better” | This is an **A/B experiment**, not a brand flip. |
| Existing cream sections (About body, IG strip, shop body, forms) | Already a light register — keep them. |

### Recommendation (do this)

1. **Do not** build a full site-wide light mode + dark mode toggle in v1 of this feedback pass.
2. **Do** introduce a small **surface token layer** so sections can be `black` | `navy` | `cream` | `lime` without rewriting every page.
3. **Do** ship a temporary **Home surface preview** (query `?surface=navy` or an admin/dev toggle) so Oumou can compare black vs blue/green **on the same layout**.
4. **Revisit** a real light/dark theme toggle only if, after the navy experiment, she still wants two permanent modes. Full dual-theme doubles CSS, header, forms, and admin QA cost — not justified by this PDF alone.

### If we later add themes

Only then: `data-theme="dark" | "light"` on `<html>`, CSS variables for bg/text/border, persist preference, respect `prefers-color-scheme` as default. Light theme would map cream body + navy text; dark stays black + lime. **Out of scope until feedback confirms.**

---

## 1. What the PDF is asking for (mapped to the real site)

The PDF is 9 pages of on-screen notes. Empty pages 8–9 are ignored. Mapped to **current** staging structure (`apps/web`).

### 1.1 Global / chrome

| Feedback | Current reality | Target |
|---|---|---|
| Reduce text size slightly | Hero manifesto, section H2s, portal titles, and editorial titles are large (`text-3xl`→`text-7xl` range) | Scale display type down ~10–15% sitewide via token/utility, not one-off hacks |
| Background → blue / keep everything else | Public layout root is `bg-sife-black` | Experiment: navy page/section backgrounds; keep lime accents, cream islands, coral CTAs, Archivo, manifesto copy |

### 1.2 Home — Instagram strip

| Feedback | Current | Target |
|---|---|---|
| Shape of IG “tabs” looks strange / too crammed | Phone-frame cards in a marquee (`InstagramStrip` + `InstagramMarquee`), cream band | Less chrome: drop or slim the fake phone header bar; more gap; slightly larger stills or fewer visible frames; keep continuous marquee |
| Likes black here / try blue | Cream IG section today | Offer **cream (current)** vs **black** vs **navy** as surface options; default stay cream until she picks |

### 1.3 Home — portal / discovery

| Feedback | Current | Target |
|---|---|---|
| Layout options so people find what they want between latest stories, films/interviews, events | `PortalRow` = 3 big cards (Films, Stories, Database). Latest stories are a separate `EditorialList`. Events are `PreviousEvents` near the bottom. No “upcoming” CTA on home | Redesign the post-hero discovery block: clearer paths to **Latest**, **Watch**, **Events (upcoming)**, without three same-height towers competing |

### 1.4 Home — section density / repetition

| Feedback | Current | Target |
|---|---|---|
| “This section/style is too repetitive if we have the other one already” | Portal cards + Latest list + Featured film + Network CTA + Previous events share similar uppercase titles + large media rhythm | Audit home for duplicate jobs; remove or merge one list-style block if it repeats PortalRow’s job |
| “Rest of landing is great but can we make sizes a bit smaller? Takes my entire page…” | Full-viewport hero + large section padding (`py-20`/`py-28`) + tall media | Shorter hero (e.g. ~78–85svh), tighter section padding, slightly smaller H2s — keep cinematic, not brochure-tiny |

### 1.5 Home / Events — upcoming

| Feedback | Current | Target |
|---|---|---|
| Add “find upcoming events” | Home shows **previous** events (`PreviousEvents`). Events page already has upcoming vs past | Add a home CTA / small upcoming strip (“Find upcoming events” → `/events`) without duplicating the whole events archive |

### 1.6 Films (and similar Watch detail)

| Feedback | Current | Target |
|---|---|---|
| Page title + film feature title too similar | Film index/hero + featured block both shout large uppercase titles | Differentiate hierarchy: page label small, film title large (or reverse); avoid two nearly identical H1/H2 stacks |
| Thumbnail closer to text; YouTube-like left media + right text | `FeaturedFilm` already is text-left / media-right on large screens, but gap is wide (`gap-10`) and media is tall `aspect-[4/5]` | Tighten gap; use **landscape/video thumbnail ratio** (`16/9` or `16/10`); media **left**, copy **right** (YouTube watch feel) while keeping SIFE type |

### 1.7 New top-level: Academy

| Feedback | Current | Target |
|---|---|---|
| Add page **Academy**; move **Education** from Read into Academy | Nav: Read → Stories / Where She Stands / **Education**. Route `/education` | New nav item **Academy** (top-level or under Watch/Read TBD — recommend **top-level** next to Events). Move Education under Academy. Keep `/education` as redirect to `/academy` (or `/academy/education`) for SEO |

### 1.8 About + Work with Us

| Feedback | Current | Target |
|---|---|---|
| Make About + Work with Us visually more exciting (layout + size) | About = portrait hero + cream prose + framework + contact. Work with Us = PageHero + accordion + long rich text + form + one collaboration card | Stronger visual rhythm: larger media moments, less wall-of-text, clearer section breaks |
| Especially the 4 points on Work with Us; text will get shorter later | `WorkAccordion` + long CMS body with many H4s | Redesign the four points as a **visual grid** (not accordion-only); leave copy editable in CMS; prepare for shorter text |
| Photos / portfolio of past projects | One featured collaboration (`CollaborationCard`) | Portfolio-style strip of collaborations / past projects (CMS `collaborations` collection already exists — surface more than one) |

### 1.9 Tone

Page 7: “YOU ARE DOING AMAZING !!!” — keep confidence; this pass is polish + IA, not a rebuild.

---

## 2. Platform memory (what we are changing against)

Do not redesign in a vacuum. Preserve:

- **Brand words:** hero manifesto and footer manifesto (verbatim).
- **Founder:** Oumou Aidara; About portrait hero with baked-in quote still is intentional unless she supplies a clean crop.
- **Framework:** Embodiment / Inclusion / Relationality.
- **Stack:** `apps/web` Next.js 16 + Payload 3, Vercel + Render Postgres + Blob.
- **Admin:** roles super-admin / editor; Inbox; Shop products/orders; Instagram posts CMS.
- **Already shipped (mostly uncommitted on local `master`):** shop, IG marquee, keep-alive, inbox widget, role fixes.
- **Motion:** GSAP Reveal, Lenis, marquees — keep; prefer refining sizes over removing motion.
- **i18n:** EN/DE chrome only; body language as authored in CMS.

---

## 3. Branch strategy

### 3.1 What exists today

- Only git branch: `master` (tracks `origin/master`, **ahead 2** commits).
- Large **uncommitted** working tree (shop, Instagram, admin, etc.).
- Oldest **published** tip: `origin/master` @ `febdfce` (“Point staging at Render Postgres…”).
- Oldest **commit in history:** `49d8d8c` (blueprint-only — empty product; useless as an implementation base).

### 3.2 What we created for this work

```
feedback/sife-website-pdf  ←  branched from origin/master (oldest published tip)
```

**Why not the absolute oldest commit?** That tip has no public site to apply this PDF against.

**Why not current dirty `master` tip yet?** The feedback branch starts clean from what GitHub/staging last knew as published history. Local shop/IG work stays on `master` until you **commit** it; then we can either:

- **A (recommended):** Commit/merge current `master` work into `feedback/sife-website-pdf` as the real base, then implement PDF phases on top; or  
- **B:** Implement PDF only on the older tip (would re-lose shop/IG until re-merged — not recommended).

### 3.3 Rules for this branch

- No force-push to `master`.
- No production deploy of feedback until Oumou signs off on navy experiment + Academy IA.
- Commit PDF blueprint first; implementation only after **start**.
- Prefer small PRs per phase below.

---

## 4. Design principles for the pass

1. **One job per section** — if PortalRow already routes people, don’t add a second identical three-card row.
2. **Black stays default chrome** — navy is an experiment surface, not a silent global replace.
3. **Smaller, not quieter** — reduce type/padding scale; keep contrast and motion.
4. **CMS first** — Academy page, collaboration portfolio, upcoming events: editable in Payload.
5. **No Touristopia / Earthrise assets** — structure only.
6. **Don’t reopen About portrait hero debate** unless she asks again; last signed-off state is portrait-in-hero.

---

## 5. Implementation phases (step by step)

Do not start until **start**. After start, execute in order. Pause on **pause**.

### Phase 0 — Hygiene (half day)

1. Commit or stash local `master` work so nothing is lost (only when you say **commit**).
2. Checkout `feedback/sife-website-pdf`.
3. Merge/rebase the committed feature tip so feedback sits on real platform (shop + IG + admin).
4. Confirm staging env still points at Render + Blob.
5. Snapshot screenshots of home, films, about, work-with-us, education (before).

**Exit:** Branch builds locally; blueprint linked in PR description.

### Phase 1 — Type + spacing scale (half day)

**Goal:** “Reduce text size slightly” + “landing takes my entire page”.

1. Add CSS tokens in `globals.css`, e.g. `--sife-display`, `--sife-section-y`.
2. Reduce home hero title, portal H2s, editorial H2s, featured film H2 by ~10–15%.
3. Reduce home section vertical padding (`py-20/28` → closer to `py-14/20`).
4. Cap cinematic hero height (~`min-h-[85svh]` or similar) so first scroll reveals the next section sooner.
5. Visual QA desktop + mobile.

**Exit:** Landing feels denser without looking like a marketing template.

### Phase 2 — Surface tokens + navy experiment (1 day)

**Goal:** Try blue/green without abandoning black.

1. Define section surfaces: `black` | `navy` | `cream` | `lime` as reusable class bundles.
2. Wire home sections to tokens (hero stays black; try navy behind portals and/or featured film).
3. IG strip: variants cream / black / navy (CSS or prop).
4. Dev-only or `?surface=navy` preview for Oumou.
5. Do **not** flip global layout to cream/white.

**Exit:** She can compare; we record her pick in this doc before locking defaults.

### Phase 3 — Instagram frame redesign (half–1 day)

**Goal:** Less crammed, less “strange tabs”.

1. Soften or remove phone chrome (avatar row) if it reads as fake UI chrome.
2. Increase gap between frames; adjust frame width.
3. Keep infinite marquee + pause on hover + CMS/API feed.
4. Apply chosen surface from Phase 2.

**Exit:** IG ribbon feels like a gallery ribbon, not a crowded widget.

### Phase 4 — Home discovery + upcoming events (1–1.5 days)

**Goal:** Find Latest / Watch / Events without repetition.

1. Map current home jobs:

   | Block | Job |
   |---|---|
   | CinematicHero | Brand |
   | Marquee | Manifesto |
   | PortalRow | Route to Watch / Read / Database |
   | InstagramStrip | Social proof |
   | EditorialList | Latest stories |
   | FeaturedFilm | Deep Watch CTA |
   | NetworkCta | Database join |
   | PreviousEvents | Past events |

2. Propose one layout (implement after her OK if ambiguous):

   - Keep PortalRow **or** replace with a tighter “Explore” rail (Watch · Read · Events · Database).
   - Keep Latest **or** shrink it if portals already cover Read.
   - Add **Upcoming events** module: 1–3 next events + CTA “Find upcoming events” → `/events`.
   - Keep PreviousEvents only if it doesn’t duplicate the new upcoming module (or rename / move past to `/events` only).

3. Implement chosen layout; CMS for event dates already exists.

**Exit:** One clear path to upcoming events on home; no two sections doing the same job.

### Phase 5 — Films featured layout (1 day)

**Goal:** YouTube-like proximity; clearer title hierarchy.

1. Film index: ensure page title ≠ featured film title treatment.
2. Featured block: media **left**, text **right**; `aspect-video` thumbnail; reduce grid gap.
3. Align film detail page embed + title spacing with the same grammar.
4. Check interviews for the same issue if they share components.

**Exit:** Featured film reads as “player + meta”, not two competing posters.

### Phase 6 — Academy IA (1–1.5 days)

**Goal:** New Academy; Education moves out of Read.

1. Payload: page slug `academy` (and optional child content later).
2. Seed: Academy page from current Education copy/structure where it fits.
3. Nav (`site.ts` + CMS Site global + `messages/en.json` + `de.json`):

   ```
   Watch → Films, Field Interview
   Read → Stories across borders, Where She Stands
   Academy → (Education landing; room for future modules)
   Events · Shop · About…
   ```

4. Redirect `/education` → `/academy` (or `/academy` hosts education body).
5. Sitemap + footer links update.
6. Empty-state ready for future Academy modules (workshops, syllabus — not invented now).

**Exit:** Education no longer under Read; Academy visible in header.

### Phase 7 — About + Work with Us energy (1.5–2 days)

**Goal:** More exciting layout; portfolio for past work; shorter-ready 4 points.

1. **About:** Keep portrait hero. Tighten cream body measure; optionally enlarge framework cards; contact stays.
2. **Work with Us:**
   - Replace accordion-primary pattern with a **4-point visual grid** (icons optional — prefer photo or colour blocks, not generic icon packs).
   - CMS fields for short titles + one-liners (so she can shorten text later without layout break).
   - **Portfolio strip:** list published `collaborations` (not only featured one) as image+title cards.
3. Do not invent fake past projects — only CMS data.

**Exit:** Work with Us feels like a studio page; About feels intentional, not a text dump under a hero.

### Phase 8 — QA, i18n, deploy (1 day)

1. EN/DE chrome for Academy + new CTAs.
2. A11y: contrast on navy+lime, focus states, reduced motion.
3. Lighthouse sanity on home + films + academy.
4. Deploy preview; then staging when she says **deploy**.
5. Update this doc with locked decisions (surface default, home module order).

---

## 6. Explicit non-goals (this pass)

- Full light/dark theme system (see §0).
- Rewriting manifesto / framework copy.
- Rebuilding shop or Instagram API (already done — only visual polish on IG).
- Stripe / tax-deductible donations.
- Squarespace cutover / custom domain (unless asked).
- Inventing Academy curriculum content.
- Changing About back to side-by-side portrait (reverted at her request).

---

## 7. Decision log (fill as we go)

| Date | Decision | Owner |
|---|---|---|
| 2026-09-18 | No full light/dark v1; navy surface experiment instead | Proposed |
| 2026-09-18 | Branch `feedback/sife-website-pdf` from `origin/master` | Proposed |
| 2026-09-20 | Client accepted recommendation: black default + `?surface=navy` experiment; no dual theme | Confirmed |
| 2026-09-20 | Implementation started on `feedback/sife-website-pdf` (Phases 1–7 in progress) | In progress |
| _TBD_ | Home: keep or replace PortalRow | Oumou |
| _TBD_ | Default IG surface: cream / black / navy | Oumou (default cream for now) |
| 2026-09-20 | Academy top-level; Education removed from Read; `/education` → `/academy` | Implemented |

---

## 8. Commands cheat sheet

```bash
# This feedback branch
git checkout feedback/sife-website-pdf

# Local app
docker compose up -d
cd apps/web && npm run dev
# http://localhost:3000  |  /admin

# After start: implement phases 1→8
# Deploy only when asked: vercel --prod --yes (from apps/web)
```

---

## 9. Success criteria

- [ ] Type/padding scale feels calmer; hero doesn’t eat the whole first impression alone.
- [ ] Navy/blue experiment reviewable without destroying black chrome.
- [ ] IG ribbon less crammed.
- [ ] Home has a clear “upcoming events” path; less repetitive stacking.
- [ ] Featured film is left-thumb + right-meta, titles not twins.
- [ ] Academy exists; Education removed from Read.
- [ ] Work with Us has visual 4-point layout + collaboration portfolio.
- [ ] Staging matches the branch; Oumou sign-off recorded in §7.

---

## 10. How to proceed with me

| You say | I do |
|---|---|
| **start** | Begin Phase 0/1 on `feedback/sife-website-pdf` |
| **pause** | Finish current step, stop |
| **deploy** | Push build to Vercel staging |
| **commit** | Commit only what you ask |
| Change a §7 decision | Update this doc, then implement |

**Do not implement until you say start.** If you want light/dark anyway despite §0, say so explicitly and Phase 2 expands into a real theme system.
