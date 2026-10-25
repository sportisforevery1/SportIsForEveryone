# Sport Is For Everyone — web app

Public site and Payload admin live in this folder. Next.js App Router, Payload CMS 3, PostgreSQL, GSAP/Lenis, next-intl (EN/DE chrome).

## Run locally

From the repository root:

```bash
docker compose up -d
# Postgres is published on host port 15432 so it does not collide with a local Postgres service or Windows reserved ports.
```

Then in `apps/web`:

```bash
cp .env.example .env
# Set PAYLOAD_SECRET to a long random string (32+ characters).
npm install
npm run dev
```

- Public (English): http://localhost:3000
- Public (German UI chrome): http://localhost:3000/de
- Admin: http://localhost:3000/admin

German routes use the same paths with a `/de` prefix (`/de/about`, `/de/database`). Body copy stays in the language it was written in. If a German translation is not in the CMS yet, English is shown with a short note.

## Env

Copy from `.env.example`:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres, host port **15432** |
| `PAYLOAD_SECRET` | Required. Admin session signing |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata and sitemap |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional. `/donate` stays a mail path until Stripe is wired |
| `INSTAGRAM_ACCESS_TOKEN` | Optional. Live Graph feed on the homepage; CMS stills if unset |

Do not commit `.env`.

## Admin login

- Local: http://localhost:3000/admin
- Staging: https://sport-is-for-everyone.vercel.app/admin

After a super-admin exists, `/admin` is **login**, not create-user. Super-admins (Settings → Users) can invite editors or other super-admins, and can delete users. Editors can sign in and edit content, but cannot manage users.

Create the first super-admin (do not commit the password):

```bash
# In apps/web .env
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=at-least-12-characters
npm run payload -- run src/scripts/ensure-super-admin.ts
```

The public site returns published (or approved) documents only. Join-the-database submissions create **pending** projects until an editor publishes them.

## Collections

| Admin group | Collection | Notes |
|---|---|---|
| Content | Pages | About, Work with us, Impressum, and other singleton pages. SEO tab feeds public metadata. |
| Content | Films | Draft/publish, featured, poster, embed URL |
| Content | Field Interviews | Ready to publish; empty until editors add pieces |
| Content | Stories | Category: borders / Where She Stands / education |
| Content | Events | Upcoming vs past, separate from draft/publish |
| Content | Instagram posts | Homepage ribbon. Live Graph API when `INSTAGRAM_ACCESS_TOKEN` is set; otherwise CMS stills. Hide by External ID. |
| Network | Database projects | `pending` until approved; only `published` is public |
| Network | Tags | Shared chips for the database and films |
| Network | People | Founder and collaborators |
| Network | Collaborations | Partnerships such as Oumou x Roots |
| Inbox | Submissions | Contact, work-with-us, join-the-database forms |
| Settings | Media, Users, Site | Uploads, editors, manifesto / socials / contact |

## Seed content

With Postgres running and `.env` set:

```bash
npm run seed
```

This uploads brand photography from `public/seed/` and creates published films, events, pages, tags, database projects, the founder record, the Oumou x Roots collaboration, and Instagram stills. Safe to re-run; existing slugs are updated.

Instagram-only (after compressing stills from the local dump):

```bash
npm run payload -- run src/scripts/seed-instagram.ts
```

Live Graph upsert into the CMS (needs `INSTAGRAM_ACCESS_TOKEN`):

```bash
npm run payload -- run src/scripts/sync-instagram.ts
```

Create the first admin user at `/admin` separately.

## Deploy notes

**Hosting split (option A):**
- **Vercel** — Next.js + Payload (`apps/web`). Staging: https://sport-is-for-everyone.vercel.app
- **Render** — managed Postgres (`sife-staging-db`, Frankfurt). See root `render.yaml`.

Custom domain stays off until asked.

**Local vs staging media:** Keep `BLOB_READ_WRITE_TOKEN` out of `.env.local`. Local uses disk files in `media/`. Staging/production uses Vercel Blob. If Blob uploads exist but pages 404 on `/api/media/file/...`, repair URLs:

```bash
# staging env loaded
npm run payload -- run src/scripts/repair-blob-urls.ts
```

Set these on Vercel (Production; Preview when you wire GitHub):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Render Postgres external URL. Include `sslmode=require` (or `uselibpqcompat=true&sslmode=require`). |
| `PAYLOAD_SECRET` | Long random string, 32+ characters. Do not reuse the local example. |
| `NEXT_PUBLIC_SITE_URL` | Staging origin, no trailing slash (`https://sport-is-for-everyone.vercel.app`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store `sife-media`. Local Docker omits this and stores uploads on disk. |

Fresh database (once):

```bash
# With staging DATABASE_URL in the environment:
PAYLOAD_DATABASE_PUSH=true npm run payload -- run src/scripts/push-schema.ts
```

After the first deploy:

1. Open `/admin` and create the editor user.
2. From `apps/web`, seed against staging (do not commit `.env` or `.env.staging.local`):

```bash
# Use staging DATABASE_URL, PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL, and BLOB_READ_WRITE_TOKEN
npm run seed
```

Legacy Squarespace paths such as `/contact` and `/join-the-database` redirect to the new routes. Custom domain and remaining Squarespace redirects wait until the live cutover.

The Render free Postgres instance expires after ~30 days unless you add billing and upgrade the plan.
