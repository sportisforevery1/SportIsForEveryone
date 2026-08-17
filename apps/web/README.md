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

Do not commit `.env`.

## Admin login

1. Open `/admin`.
2. The first time, create the first user (email + password). That account is the editor.
3. Later visits: sign in with that email and password.

Only logged-in editors can write. The public site returns published (or approved) documents only. Join-the-database submissions create **pending** projects until an editor publishes them.

## Collections

| Admin group | Collection | Notes |
|---|---|---|
| Content | Pages | About, Work with us, Impressum, and other singleton pages. SEO tab feeds public metadata. |
| Content | Films | Draft/publish, featured, poster, embed URL |
| Content | Field Interviews | Ready to publish; empty until editors add pieces |
| Content | Stories | Category: borders / Where She Stands / education |
| Content | Events | Upcoming vs past, separate from draft/publish |
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

This uploads brand photography from `public/seed/` and creates published films, events, pages, tags, database projects, the founder record, and the Oumou x Roots collaboration. Safe to re-run; existing slugs are updated.

Create the first admin user at `/admin` separately.

## Deploy notes

Do not deploy until asked. When that happens:

1. Managed Postgres and blob storage for uploads (local `media/` is gitignored).
2. Set the same env vars on the host. `NEXT_PUBLIC_SITE_URL` must be the live origin.
3. Run migrations / seed on first boot, then create the admin user.
4. Staging URL first; custom domain and Squarespace redirects later.
5. `/admin` stays on the same Next app.
