# SIFE accounts + Academy / Events — implementation blueprint

**Status:** Phases A–F implemented + locally verified — **do not deploy** until green light.  
**Date:** 25 October 2026  
**Updated:** 25 October 2026 (local QA 26/26 + browser signup)  
**Source:** WhatsApp with Oumou (Oct 2026) + current `apps/web` staging.  
**Companions:** `docs/sife-website-feedback-blueprint.md`, `docs/sife-shop-blueprint.md`, root `BLUEPRINT.md`.  

| | |
|---|---|
| **App** | `apps/web` — Next.js 16 + Payload 3 |
| **Hosting** | Vercel (Hobby) |
| **DB** | Render Postgres (free tier = cold starts / slowness — expected) |
| **Media** | Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set |
| **Staging URLs** | Prefer `sport-is-for-everyone-zeta.vercel.app` / `…-eta.vercel.app` |
| **Deploy rule** | Push/deploy **only** when you say **deploy** |

This document is the single source of truth for the **next product program**: learner accounts, enrolments, progress, join links, Academy vs Events/camps, and (later) optional embedded video. Visual polish of other pages may continue in parallel but must not invent conflicting Academy/auth behaviour.

---

## How to use this doc

1. Read **§0 Locked decisions** and **§2 User journeys** before coding.  
2. Implement **one phase at a time** (§8). Each phase has: goal → prerequisites → numbered steps → files → acceptance tests → exit.  
3. After each phase: update **§11 Decision log** if anything changed; only then ask for **deploy**.  
4. Commands from you:

| You say | Agent does |
|---|---|
| `start phase A` … `start phase H` | That phase only |
| `start events` | Phase B |
| `start accounts` | Phase A (if unfinished) then C → D → E in order, pausing between phases unless you say otherwise |
| `pause` | Finish current step, stop |
| `deploy` | Commit (if asked), push, verify staging |
| Change a decision | Edit §0 / §11 first, then code |

---

## 0. Locked decisions

| # | Decision | Detail |
|---|---|---|
| D1 | **Video v1 = share link** | Zoom / Meet / etc. pasted into CMS. No Daily / LiveKit / Zoom Video SDK yet. |
| D2 | **Video embed later** | Only if she asks after link flow works. Prefer Daily.co then. |
| D3 | **Academy = courses** | Modules, access, syllabus. Payload group “Academy”. |
| D4 | **Events = dated gatherings** | Talks, hikes, runs, open sessions, **camps**. Separate collection. |
| D5 | **Camps ≠ third nav** | Camp is an **event type** (or label), not `/camps`. |
| D6 | **Academy ↔ Events** | Optional “Also list on Academy” — **build only after her explicit yes**. |
| D7 | **Accounts next** | Learner signup/login, my courses, DB progress; shop history optional. |
| D8 | **Access codes stay** | Backup / invite path; not the only identity forever. |
| D9 | **No full LMS** | No grades, certificates, whiteboards, BBB, LearnCube in this program. |
| D10 | **No deploy** until you say deploy. |
| D11 | **Auth preference** | Payload users + `learner` role (same DB). Clerk only if you later override. |
| D13 | **Roles** | One Users table. Public signup = learner only. Super-admin seeded (`ensure-super-admin`); only super-admin assigns `editor` / `super-admin`. Shop + database join stay guest-friendly. |
| D12 | **Join URL visibility (default)** | Prefer show join link to **enrolled learners** (or on Event if she chooses “public link”). Confirm in §11 when she answers. |

---

## 1. Product intent (why this exists)

Oumou’s Academy is **cohort courses** with **live attendance** (video call links now; in-person camps later), not only static modules behind a device cookie.

Learners need to:

1. Create an account and log in.  
2. Enrol in a course (admin invite, access code, or later request).  
3. Open modules in order; progress follows **them**, not the browser.  
4. See **when** to show up and **where** (join link / place).  
5. Optionally see **shop order history** on the same account.

Editors (Oumou) need to:

1. Edit content without sharing a super-admin password.  
2. Post Events (including camps) with date/place/(optional) join link.  
3. Manage who is invited/active on a course.  
4. Keep Academy and Events mentally separate in admin, with an optional later bridge.

---

## 2. Information architecture

### 2.1 Public nav (unchanged top-level names)

```
Watch · Read · Academy · Events · Shop · About · Database
```

| Area | Job | Primary collections |
|---|---|---|
| Academy | Programs / courses / modules | `courses`, `course-enrolments`, (new) `course-progress` |
| Events | Dated gatherings + camps | `events` |
| Account (new) | Login, my courses, orders | `users` (learner), enrolments, orders |
| Shop | Editions / checkout | `products`, `orders` |

### 2.2 Admin groups (Payload)

| Group | Collections |
|---|---|
| Academy | Courses, Course enrolments, Course progress (new) |
| Editorial | Events, Films, Stories, … |
| Shop | Products, Orders |
| Settings | Users, Site |

### 2.3 Proposed URL map

| Route | Who | Purpose |
|---|---|---|
| `/academy` | Public | Course index |
| `/academy/[slug]` | Public | Course landing + unlock / enrol CTA |
| `/academy/[slug]/[moduleSlug]` | Public + gate | Module player |
| `/events` | Public | Upcoming + past |
| `/events/[slug]` | Public | Event detail + optional Join |
| `/login` | Public | Learner (and optionally editor) login |
| `/signup` | Public | Learner registration only |
| `/account` | Learner | Overview |
| `/account/courses` | Learner | My courses |
| `/account/orders` | Learner | Order history (Phase F) |
| `/logout` | Auth | Clear session |
| `/admin` | editor / super-admin only | CMS — **learners redirected away** |

---

## 3. User journeys (step-by-step)

### 3.1 Oumou (editor) — day one

1. Opens `/admin` with **her editor** account (not shared super-admin).  
2. Edits Pages, Courses, Events, Collaborations, Media.  
3. Creates an Event “Consistency open session” → date, location, pastes Zoom `joinUrl`.  
4. Invites a learner: Academy → Course enrolments → email + course → status Invited (or Active + code).  
5. Tells learner to sign up with that email and open Academy.

### 3.2 Learner — enrol with code

1. Visits `/signup` → email, password, name → role forced to `learner`.  
2. Logs in → header shows Account.  
3. Opens `/academy/consistency-academy` → enters access code.  
4. System: validates code → creates/updates `course-enrolments` (`user`, `active`, code) → may still set cookie for transition.  
5. Opens module 1 → progress row written.  
6. Sequential modules unlock from **DB opened list**.  
7. `/account/courses` lists Consistency Academy → Continue.

### 3.3 Learner — live session (link v1)

1. Admin added Event or Course session with `joinUrl` + time.  
2. Learner (enrolled) sees **Join** on event detail and/or course landing “Upcoming sessions”.  
3. Click opens external Zoom/Meet in new tab.  
4. No in-app video chrome.

### 3.4 Learner — shop (Phase F)

1. Logged in → checkout → order saved with `user` + email.  
2. `/account/orders` lists past orders.

### 3.5 Anonymous visitor

1. Can browse Academy teasers, Events, Shop.  
2. Cannot see gated module bodies.  
3. Optional: code unlock without account **legacy** path until Phase D exit deprecates it.

---

## 4. Current platform inventory (as-built)

| Piece | Location / behaviour | Gap vs target |
|---|---|---|
| Users | `collections/Users.ts` — auth; roles `super-admin` \| `editor` | No `learner`; admin access = any logged-in user |
| Roles helpers | `access/roles.ts` | Need `isLearner`, `isEditor`, block learner from `/admin` |
| Courses | `collections/Courses.ts` + unlock | Cookie progress in `lib/academy/unlock.ts` |
| Enrolments | `collections/CourseEnrolments.ts` — email, course, code, status | No `user` relationship |
| Unlock API | `app/api/academy/unlock`, `progress` | Cookie-centric |
| Events | `collections/Events.ts` — dates, timing, body | No `joinUrl`, no `eventType` |
| Orders | `collections/Orders.ts` — guest checkout fields | No `user` |
| Cart | client `lib/shop-cart` | OK to stay local |
| Public Academy UI | `app/(public)/academy/**`, `components/academy/*` | No “my courses”; Next locked = sequential/cookie |

---

## 5. Target data model

### 5.1 `users` (extend)

| Field | Type | Notes |
|---|---|---|
| email | email (auth) | Existing |
| password | auth | Existing |
| name | text | Existing |
| role | select | Add **`learner`**. Default for public signup = `learner`. Admin-created users stay editor/super-admin. |

**Access rules (target):**

- `admin` UI: only `super-admin` \| `editor` (not learner).  
- Learner: read/update **self** only via public account APIs.  
- Public signup endpoint/hook: force `role: learner`; never allow client to set `super-admin`.

### 5.2 `course-enrolments` (extend)

| Field | Type | Notes |
|---|---|---|
| email | email | Keep (invite before signup) |
| user | relationship → users | Nullable until linked |
| course | relationship → courses | Required |
| accessCode | text | Optional |
| status | invited \| active \| revoked | Existing |
| source | code \| request \| admin | New |
| enrolledAt | date | New, set when → active |

**Indexes:** unique-ish pair `(course, email)` or `(course, user)` enforced in hook to avoid duplicates.

### 5.3 `course-progress` (new collection)

| Field | Type | Notes |
|---|---|---|
| user | relationship → users | Required |
| course | relationship → courses | Required |
| moduleSlug | text | Required |
| openedAt | date | Required |
| completedAt | date | Optional later |

**Unique:** `(user, course, moduleSlug)`.  
Admin group: Academy.  
Access: authenticated admin read all; learners create/update only own rows via server actions/API.

### 5.4 `events` (extend)

| Field | Type | Notes |
|---|---|---|
| joinUrl | text | Zoom/Meet URL |
| eventType | select | `talk` \| `hike` \| `run` \| `open-session` \| `camp` \| `other` (default `other`) |
| showOnAcademy | checkbox | **Phase G only** |
| relatedCourse | relationship → courses | **Phase G only** |

### 5.5 `courses` (optional extend — Phase B/D)

| Field | Type | Notes |
|---|---|---|
| sessions | array | `{ title, startsAt, endsAt?, joinUrl, notes }` — cohort calls not public as Events |

### 5.6 `orders` (extend — Phase F)

| Field | Type | Notes |
|---|---|---|
| user | relationship → users | Nullable for guest checkout |

---

## 6. Access & unlock rules (target)

Reuse module `unlockMode`: `always` | `with_course` | `sequential` (already in seed / unlock lib).

| Mode | Can view full module body when |
|---|---|
| `always` | Always (public teaser+body) |
| `with_course` | Active enrolment **or** (legacy) valid course cookie |
| `sequential` | Active enrolment/cookie **and** every previous non-`always` module has progress `openedAt` |

**Priority after Phase E:**

1. If logged-in learner with `active` enrolment → use DB progress.  
2. Else if legacy cookie valid → cookie progress (warn in UI: “Sign up to keep progress”).  
3. Else locked → show unlock / login CTA.

---

## 7. UI / UX requirements (non-visual product)

### 7.1 Header

- Logged out: link **Log in** (or Account).  
- Logged in learner: **Account** → `/account`.  
- Editors using public site: same; `/admin` link can remain for editor/super-admin only.

### 7.2 Account shell

- Greeting + email  
- Nav: Courses · Orders (Orders after F) · Log out  
- Empty states in SIFE cream/navy language (no admin leakage)

### 7.3 Course landing

- If not enrolled: Unlock with code **and** “Log in / Sign up to save progress”.  
- If enrolled: “Continue” to first incomplete module; list **Upcoming sessions** (join links).

### 7.4 Events detail

- Facts: when / where / type  
- If `joinUrl` and viewer allowed: coral **Join session** button (`target=_blank`, `rel=noreferrer`)  
- Camps use `eventType=camp` badge in cards

### 7.5 Copy / i18n

- Add `account.*` and any new chrome strings to `messages/en.json` + `de.json`.  
- CMS body content remains single-locale until a separate localization project.

---

## 8. Implementation phases (detailed)

---

### Phase A — Hygiene & editor access for Oumou

**Goal:** She can edit staging safely; stop shared password risk.  
**Estimate:** 0.5 day  
**Depends on:** Staging admin reachable  

#### Steps

1. **Inventory users** in Admin → Users on staging.  
2. **Create editor** for Oumou (email she chooses); role `editor`; strong password shared privately (not WhatsApp if possible).  
3. **Rotate** any password that appeared in chat (`Test@123` or similar) on the super-admin account.  
4. **Smoke test as editor:** edit a Page, an Event, a Course teaser, upload Media — confirm permissions.  
5. **Tell her** staging is slow on free Render DB; content edits are OK.  
6. **Optional:** Add short note to `apps/web/README.md` under staging: “Editor vs super-admin; free DB cold starts.”

#### Files / ops

- Ops mostly in Payload Admin UI  
- Optional doc touch: `apps/web/README.md`

#### Acceptance tests

| # | Test | Pass |
|---|---|---|
| A1 | Oumou logs into `/admin` as editor | ☐ |
| A2 | Editor can publish Event + edit Course | ☐ |
| A3 | Old shared password no longer works (or is rotated) | ☐ |
| A4 | Learner role **not** required yet | ☐ |

**Exit:** A1–A3 pass.  
**Deploy:** not required unless README change pushed.

---

### Phase B — Events polish + joinUrl (+ eventType)

**Goal:** Events feel intentional; camps/sessions can carry a join link.  
**Estimate:** 1–1.5 days  
**Depends on:** Phase A recommended  
**Do not:** `showOnAcademy` (Phase G)

#### Steps

1. **Schema — Events** (`collections/Events.ts`):  
   - Add `joinUrl` (text, admin description: “Zoom/Meet link for attendees”).  
   - Add `eventType` select with options in §5.4.  
2. **Regenerate types** / push schema (`PAYLOAD_DATABASE_PUSH` on staging once if needed).  
3. **Seed (optional):** one upcoming event with `eventType: open-session` and placeholder joinUrl for local QA.  
4. **Lib:** `lib/events.ts` — expose `joinUrl`, `eventType` on public event type.  
5. **UI polish — index** (`app/(public)/events/page.tsx`, `components/events/EventCards.tsx`):  
   - Match Stories rhythm (`PageHero` compact, `sife-section`).  
   - Show type badge when not `other`.  
6. **UI polish — detail** (`EventArticle` or equivalent):  
   - Join CTA if `joinUrl` present (Phase B default: show if URL set; tighten visibility in Phase D/G if she wants enrolled-only).  
7. **i18n:** `events.join`, `events.camp`, etc. in en/de.  
8. **Manual QA** desktop + mobile.

#### Acceptance tests

| # | Test | Pass |
|---|---|---|
| B1 | Admin can set event type + join URL | ☐ |
| B2 | Public event detail shows Join when URL set | ☐ |
| B3 | Events index matches site section rhythm (no orphan sparse slab) | ☐ |
| B4 | Camp-type event shows distinct label | ☐ |

**Exit:** B1–B4 pass.  
**Deploy:** only on your **deploy**.

---

### Phase C — Learner auth shell

**Goal:** Public signup/login/logout; learners cannot open CMS.  
**Estimate:** 1.5–2 days  
**Depends on:** Phase A  
**Auth choice:** Payload (D11) unless you override.

#### Steps

1. **Role:** Add `learner` to `Users` role options; `saveToJWT: true`.  
2. **Access:**  
   - `admin: ({ req }) => editor \|\| super-admin` (not learner).  
   - Middleware or admin layout: if learner hits `/admin` → redirect `/account`.  
3. **Public auth routes** under `app/(public)/`:  
   - `login/page.tsx`, `signup/page.tsx`, logout route/action.  
4. **Server actions / API:**  
   - Signup: `payload.create({ collection: 'users', data: { email, password, name, role: 'learner' } })` with override rules that forbid elevating role.  
   - Login: Payload login → set auth cookie.  
5. **Account shell:** `app/(public)/account/page.tsx` — requires auth; show name/email; links to Courses (placeholder OK).  
6. **Header:** Account / Log in entry (`components` chrome / site header).  
7. **i18n:** `account.*` namespace en + de.  
8. **Protect:** Rate-limit signup if trivial (optional basic).  

#### Files (expected touch list)

- `collections/Users.ts`  
- `access/roles.ts` (+ new helpers)  
- `app/(public)/login/page.tsx`, `signup/page.tsx`, `account/page.tsx`  
- `lib/auth/*.ts` (session helpers)  
- Header component(s)  
- `messages/en.json`, `messages/de.json`  
- Middleware if needed for `/account`  

#### Acceptance tests

| # | Test | Pass |
|---|---|---|
| C1 | Signup creates user with role learner | ☐ |
| C2 | Learner login works; `/admin` redirects away | ☐ |
| C3 | Editor/super-admin still reach `/admin` | ☐ |
| C4 | `/account` 401/redirect when logged out | ☐ |
| C5 | Header reflects auth state | ☐ |

**Exit:** C1–C5 pass.

---

### Phase D — Enrolment + My courses + code unlock for users

**Goal:** Code/admin invite attaches to a person; My courses works.  
**Estimate:** 1.5–2 days  
**Depends on:** Phase C  

#### Steps

1. **Schema:** Add `user`, `source`, `enrolledAt` to `course-enrolments`.  
2. **Hook:** On user signup, if enrolments exist with same email → set `user`, optionally `status: active` if invited.  
3. **Unlock API** (`api/academy/unlock`):  
   - If logged in: on success, upsert enrolment (`source: code`, `active`) + keep cookie for transition.  
   - If logged out: existing cookie behaviour + prompt to create account.  
4. **Access check** in `lib/courses.ts` / unlock: `active` enrolment for `(user, course)` counts as unlocked.  
5. **UI:** `/account/courses` — list active enrolments with link to course.  
6. **Course landing CTA:** “Save progress — create account” if cookie-only.  
7. **Admin:** Enrolments list shows user when linked.  

#### Acceptance tests

| # | Test | Pass |
|---|---|---|
| D1 | Logged-in code unlock creates active enrolment | ☐ |
| D2 | My courses lists that course | ☐ |
| D3 | Admin invite by email links on signup | ☐ |
| D4 | Revoked enrolment cannot open gated modules | ☐ |
| D5 | Anonymous cookie unlock still works (legacy) | ☐ |

**Exit:** D1–D4 pass (D5 until E/F deprecation note).

---

### Phase E — Progress in Postgres

**Goal:** Sequential unlock and “opened” survive new devices.  
**Estimate:** 1 day  
**Depends on:** Phase D  

#### Steps

1. Create `course-progress` collection (§5.3); register in `payload.config.ts`.  
2. Update `markModuleOpened` path: if user session → upsert progress row; still update cookie if present.  
3. Update `canViewModule` inputs: for logged-in enrolled users, `opened` = slugs from DB.  
4. Migration note: optional one-time “import cookie opened → DB” not required.  
5. Account UI (optional): progress fraction per course.  
6. Deprecate messaging: cookie-only users encouraged to sign up.  

#### Acceptance tests

| # | Test | Pass |
|---|---|---|
| E1 | Open module A → row in course-progress | ☐ |
| E2 | New browser, same login → sequential state preserved | ☐ |
| E3 | Next locked until previous opened (sequential) | ☐ |
| E4 | always modules remain public | ☐ |

**Exit:** E1–E4 pass. Cookie may remain as cache only.

---

### Phase F — Shop history on same account

**Goal:** Logged-in checkout attaches orders; account can list them.  
**Estimate:** 1 day  
**Depends on:** Phase C (D/E optional)  

#### Steps

1. Add `user` to `orders`.  
2. Checkout server action: if session user, set `user`.  
3. `/account/orders` — query orders where user = me.  
4. Guest checkout unchanged.  

#### Acceptance tests

| # | Test | Pass |
|---|---|---|
| F1 | Logged-in order has user set | ☐ |
| F2 | Appears on `/account/orders` | ☐ |
| F3 | Guest order still works without user | ☐ |

**Exit:** F1–F3 pass.

---

### Phase G — Events on Academy (only if Oumou says yes)

**Goal:** Selected gatherings appear under Academy without a Camps nav.  
**Estimate:** 0.5–1 day  
**Depends on:** Phase B + her written yes  

#### Steps

1. Confirm decision in §11.  
2. Add `showOnAcademy`, `relatedCourse` on Events.  
3. Query on `/academy` and/or `/academy/[slug]`: events where showOnAcademy and upcoming.  
4. Card: title, date, link to event (join stays on event detail).  

#### Acceptance tests

| # | Test | Pass |
|---|---|---|
| G1 | Flagged event appears on Academy | ☐ |
| G2 | Unflagged event does not | ☐ |
| G3 | No new top-level nav item | ☐ |

**Exit:** G1–G3 pass.

---

### Phase H — Embedded video (only if she asks later)

**Goal:** In-site Join using a provider SDK.  
**Estimate:** 2+ days  
**Depends on:** Phases D–E; provider account  

#### Steps (outline only)

1. Choose **Daily.co** (default) unless roles need **100ms** or custom UI needs **LiveKit**.  
2. Env: provider API key on Vercel.  
3. On session start: create room; store room URL/id on session/event.  
4. Enrolled learners: embed Prebuilt or custom; still keep external link fallback.  
5. Do **not** build whiteboard/LMS features.  

#### Acceptance tests

| # | Test | Pass |
|---|---|---|
| H1 | Enrolled learner joins in-page | ☐ |
| H2 | Non-enrolled cannot | ☐ |
| H3 | Fallback link still works | ☐ |

---

## 9. Cross-cutting engineering checklist

Do these in every phase that ships code:

1. **Types:** regenerate `payload-types.ts` when schema changes.  
2. **DB:** staging push with care (`PAYLOAD_DATABASE_PUSH=true` once); never casually against production without backup.  
3. **Secrets:** never commit `.env`; never paste admin passwords into chat/docs.  
4. **i18n:** any new chrome string → `en.json` + `de.json`.  
5. **No admin leakage** in public empty states (“create in Admin → …” banned).  
6. **A11y:** Join buttons real links/buttons; focus states.  
7. **QA matrix:** desktop + mobile; logged out / learner / editor.  
8. **Perf:** free Render DB may 503 on cold start — retry; consider paid Postgres later (out of scope here).  
9. **Git:** commit when asked; branch optional `feature/accounts-academy`.  
10. **Deploy:** only on **deploy**; verify `/academy`, `/events`, `/account` on staging URL.

---

## 10. Testing script (end-to-end after D+E+B)

Run on staging after those phases:

1. Editor creates Event (camp) + joinUrl.  
2. Editor sets course access code.  
3. New browser profile → signup learner.  
4. Unlock course with code → My courses shows it.  
5. Open modules in order → Next unlocks.  
6. Open Event → Join opens provider.  
7. Log out → gated module locked.  
8. Log in elsewhere → progress intact.  
9. Editor revokes enrolment → learner locked.  
10. (F) Place shop order logged in → appears under Orders.

---

## 11. Decision log

| Date | Decision | Owner |
|---|---|---|
| 2026-10-25 | Link-based video v1; SDK later | Oumou + us |
| 2026-10-25 | Academy = courses; Events = dated; camps as events | Us / pending her nuance |
| 2026-10-25 | Accounts before embedded video | Us |
| 2026-10-25 | “Also list on Academy” waits for yes | Pending Oumou |
| 2026-10-25 | Access codes remain backup | Us |
| 2026-10-25 | Auth = Payload + learner role (default) | Us |
| _TBD_ | Join URL public vs enrolled-only | Oumou |
| _TBD_ | Clerk instead of Payload public auth | You |
| _TBD_ | Paid Postgres upgrade | You |

---

## 12. Explicit non-goals

- Full LMS (grades, certificates, quizzes, attendance gradebook)  
- Whiteboards / BigBlueButton / LearnCube  
- Raw WebRTC stack  
- Dual-language CMS fields (EN/DE content versions)  
- Renaming or removing Academy without her decision  
- Top-level **Camps** nav in v1  
- Replacing free Render DB in this blueprint (note only)

---

## 13. Success criteria (program-level)

- [ ] Oumou has editor login; exposed passwords rotated  
- [ ] Events support type + join link; UI polished to site bar  
- [ ] Learner signup/login; no CMS access  
- [ ] Enrolment by code/admin; My courses  
- [ ] Progress in Postgres per user/module  
- [ ] Access codes still work as backup  
- [ ] No video SDK until she asks  
- [ ] Optional: shop orders on account  
- [ ] Optional: Events listed on Academy  

---

## 14. Suggested reply snippets (WhatsApp)

**After she confirms camps/Academy:**

> Academy stays for courses (modules + access). Events are dated gatherings — talks, hikes, camps, open sessions — with date/place and an optional join link we share with attendees. If you want some camps to also appear under Academy, I’ll add a checkbox when you create the event.

**When starting build (internal):**

Say to the agent: `start phase A` then `start phase B` or `start accounts`.

---

## 15. Open questions (resolve before or during phase)

| # | Question | Blocks | Default if unanswered |
|---|---|---|---|
| Q1 | Join links visible to anyone with the event URL, or only enrolled? | B visibility | Show if URL set (simplify); tighten later |
| Q2 | Confirm “Also list on Academy” checkbox? | G | Do not build |
| Q3 | Public signup open to anyone, or invite-only? | C/D | Open signup + code for course materials |
| Q4 | Clerk vs Payload auth? | C | Payload |
| Q5 | Upgrade Render DB? | Perf | Stay free until pain is acute |

---

**End of blueprint.** Implement only on explicit start; one phase at a time; update §11 when decisions change.
