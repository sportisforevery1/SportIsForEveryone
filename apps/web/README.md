# Sport Is For Everyone — web app

Public site and Payload admin live in this folder.

## Run locally

From the repository root:

```bash
docker compose up -d
# Postgres is published on host port 15432 so it does not collide with a local Postgres service or Windows reserved ports.
```

Then in `apps/web`:

```bash
cp .env.example .env
npm install
npm run dev
```

- Public: http://localhost:3000
- Admin: http://localhost:3000/admin

## Admin login

1. Open `/admin`.
2. The first time, create the first user (email + password). That account is the editor.
3. Later visits: sign in with that email and password.

Only logged-in editors can write. The public API returns published (or approved) documents only.

## Collections

| Admin group | Collection | Notes |
|---|---|---|
| Content | Pages | About, Work with us, Impressum, and other singleton pages |
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
