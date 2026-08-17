# Sport Is For Everyone — web app

Public site and Payload admin live in this folder.

## Run locally

From the repository root:

```bash
docker compose up -d
# Postgres is published on host port 55432 so it does not collide with a local Postgres service.
```

Then in `apps/web`:

```bash
cp .env.example .env
npm install
npm run dev
```

- Public: http://localhost:3000
- Admin: http://localhost:3000/admin

Create the first admin user on `/admin` the first time it loads.
