# Sport Is For Everyone

Cinematic public site and Payload CMS for [sportisforeveryone.org](https://sportisforeveryone.org/). The app lives in `apps/web`.

## Local run

```bash
docker compose up -d
cd apps/web
cp .env.example .env
npm install
npm run dev
```

- Public (English): http://localhost:3000
- Public (German chrome): http://localhost:3000/de
- Admin: http://localhost:3000/admin
- Postgres: `postgresql://sife:sife@127.0.0.1:15432/sife`

The first `/admin` visit creates the editor account. Seed CMS copy and photography with `npm run seed` from `apps/web`.

See `apps/web/README.md` for collections, env vars, and staging deploy notes.

## Docs

- `BLUEPRINT.md` — product and design memory
- `PLAN.md` — phase plan
