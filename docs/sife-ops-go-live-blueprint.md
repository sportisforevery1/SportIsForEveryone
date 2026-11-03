# SIFE ops & go-live blueprint (step by step)

**Audience:** whoever is shipping Sport Is For Everyone production right now.  
**Stack (do not change unless decided):** Next.js + Payload (`apps/web`) on **Vercel Hobby team `Sport Is For Everyone Hobby` / `sifetechsupport`**, Postgres on **Render** (paid), media on **Vercel Blob**, domain registrar **Hover**, DNS **Cloudflare**.  
**Live site:** https://sportisforeveryone.org  
**Admin:** https://sportisforeveryone.org/admin  
**Date context:** Nov 2026  

Follow phases **in order**. Do not skip Phase 0–2; later polish depends on them.

---

## Phase 0 — Accounts map (read once)

| What | Correct place | Wrong place |
|---|---|---|
| Production Vercel project | Team **Sport Is For Everyone Hobby** (`vercel.com/sport-is-for-everyone/...`), user `sifetechsupport` | Personal team **GIHOZO** / CLI default for `pascagihozo` (duplicate project name; domain not attached) |
| Domain registration | Hover (`sportisforeveryone.org`) | — |
| DNS | Cloudflare zone for `sportisforeveryone.org` | Hover nameservers (already switched off for SIFE) |
| Database | Render Postgres (paid, Frankfurt-class) | Expired free DBs |
| Media files | Vercel Blob store connected to **SIFE Hobby** project | Local disk / `/api/media/file` without Blob |
| Code | GitHub `sportisforevery1/SportIsForEveryone` → `main` auto-deploys to SIFE Hobby | CLI `vercel deploy` from wrong team |

**Rule:** Always confirm the Vercel team switcher says **Sport Is For Everyone Hobby** before changing env, Blob, or domains.

`pascagihozo` can appear as the person who triggered a deploy; that does **not** mean production lives on GIHOZO.

---

## Phase 1 — Cloudflare DNS (must be correct)

### 1.1 Nameservers at Hover
- `sportisforeveryone.org` → `elisa.ns.cloudflare.com` + `jeremy.ns.cloudflare.com`
- Leave `oumou.de` on Hover NS unless intentionally moved

### 1.2 Records in Cloudflare (DNS → Records)

| Name | Type | Content | Proxy |
|---|---|---|---|
| `@` | A | Vercel IP (currently `216.198.79.1`) | **DNS only** (grey) |
| `www` | CNAME | Vercel target (`*.vercel-dns-017.com`) | **DNS only** (grey) |
| MX | MX | Google (`aspmx.l.google.com`, etc.) | DNS only (always) |
| `api` | A | `91.98.125.156` (separate host, not the Next app) | Prefer **DNS only** until SSL is healthy |

**Why grey cloud for web:** Orange proxy in front of Vercel breaks SSL verification and can break admin uploads. Traffic should go **visitor → Vercel**, with Cloudflare only answering DNS.

### 1.3 Warning on `api.sportisforeveryone.org`
- That triangle means Cloudflare’s **proxied** hostname does not yet have a covering edge certificate (common right after NS cutover, or if Universal SSL is still provisioning).
- It is **not** the main marketing site.
- Options: wait for cert; or set `api` to DNS only; or delete `api` if unused.
- Ignore SPF/DMARC “recommendations” until email branding is a priority (optional Phase 8).

### 1.4 Verify
```text
nslookup -type=NS sportisforeveryone.org
nslookup sportisforeveryone.org
nslookup www.sportisforeveryone.org
```
Expect Cloudflare NS, A/CNAME still pointing at Vercel.

---

## Phase 2 — Vercel env on SIFE Hobby (production)

In **Sport Is For Everyone Hobby** → Project `sport-is-for-everyone` → Settings → Environment Variables:

| Variable | Purpose | Notes |
|---|---|---|
| `DATABASE_URL` | Render Postgres | Production secret |
| `PAYLOAD_SECRET` | Auth/signing | Production secret |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob RW | Must match Blob store on **this** project |
| `BLOB_STORE_ID` / webhook keys | Blob extras | Auto from Storage if connected |
| `NEXT_PUBLIC_SITE_URL` | Payload `serverURL` + absolute URLs | **Must be** `https://sportisforeveryone.org` (not `*.vercel.app`) |
| `INSTAGRAM_ACCESS_TOKEN` | Optional live IG Graph feed | If set, homepage prefers Meta API |
| `CRON_SECRET` / sync secrets | Optional IG sync routes | Only if cron sync is used |

After changing `NEXT_PUBLIC_*`, a **new production build** is required (Git push to `main` or Redeploy **without** stale build cache).

**Manual Redeploy note:** Vercel may ask for an **email verification code**. Do **not** share that code with anyone/AI. Prefer pushing to `main` so Git deploys automatically.

---

## Phase 3 — Media storage & admin uploads

### 3.1 Where media lives
1. **Metadata** (alt, filename, url, sizes) → Postgres via Payload collection `media`
2. **Binary files** → **Vercel Blob** public URLs (`*.public.blob.vercel-storage.com`) when Blob is connected
3. **Fallback stills** in repo → `apps/web/public/seed/...` (seed/repair scripts; not for day-to-day CMS)

### 3.2 Why `/admin/collections/media` can look empty
- Admin list loads via `/api/media`.
- If that API returns **500**, the UI shows a blank cream pane (no rows, no error toast).
- Typical causes: schema mismatch after adding `imageSizes` without DB push; Blob/token misconfig; deploy mid-failure.
- Check: open `/api/media?limit=1` while logged out — should be JSON docs, not `Something went wrong`.

### 3.3 Upload rules (current intended config)
- Images only (`mimeTypes: image/*`)
- On upload: resize max **2400px**, convert **WebP quality ~78** (saves Blob quota)
- Prefer **server upload** path (`clientUploads: false`) so admin on the custom domain does not hit cross-origin Blob client CORS/`Failed to fetch`
- Keep each file under ~**4.5 MB** before compression (Vercel function body limit)

### 3.4 How editors upload
1. Admin → Settings → **Media** → Create New  
2. Pick image + required **Alt** → Save  
3. Confirm the saved doc URL is a `blob.vercel-storage.com` link  
4. Attach that Media doc on Pages / Events / Courses / etc.

### 3.5 Optional later: `imageSizes` (thumbnail/card)
Requires a one-shot **Payload database push** against Render (`PAYLOAD_DATABASE_PUSH=true` run carefully once), then redeploy. Do **not** enable sizes in code until columns exist.

### 3.6 Blob Hobby limits (monitor)
- Storage ~**1 GB**
- Transfer ~**10 GB**/month  
- Over limit → Blob blocked until window resets (Hobby cannot buy more)

---

## Phase 4 — Instagram posts (where they come from)

Homepage **ON INSTAGRAM** does **not** require rows in Admin → Instagram posts.

### Priority order (`getInstagramPosts`)
1. **If `INSTAGRAM_ACCESS_TOKEN` is set** → live **Instagram Graph API** (`graph.instagram.com/me/media`). Images are Meta CDN URLs (`cdninstagram.com` / `fbcdn.net`). CMS “Hidden” rows (by External ID) can hide specific live posts; Published CMS rows can add extras.
2. **Else if CMS has Published `instagram-posts`** → those rows (Media upload or `remoteUrl`).
3. **Else** → local seed stills from `apps/web/public/seed/instagram/` via `instagram-manifest.ts`.

### Why Admin → Instagram posts shows “No Results”
- Collection is empty in Postgres (normal if you rely on Graph token or seed stills).
- Description in admin is accurate: ribbon uses Graph when token exists; CMS is for overrides/extras/stills.

### How to manage
| Goal | Action |
|---|---|
| Keep live IG feed | Keep valid `INSTAGRAM_ACCESS_TOKEN` on SIFE Hobby Production |
| Hide one live post | Create Instagram post with matching **External ID**, status **Hidden** |
| Add a still not on IG | Create Instagram post, status **Published**, upload Media or set remote URL |
| Force only CMS | Remove token (then publish CMS rows or rely on seed) |

Profile link target: `@sportisforevery1` → https://www.instagram.com/sportisforevery1/

---

## Phase 5 — Fake / seed events (credibility)

### Why deleted events “come back”
- Public Events page lists **published** Payload `events` with `timing: upcoming|past`.
- Seed/demo scripts can re-insert catalog events if someone re-runs seed against production.
- cmsCache (~60s) can briefly show old lists after deletes.

### Fix process
1. Admin → **Events** → filter Published / Upcoming  
2. Unpublish or **delete** every demo/seed event (Berlin Screening Night, City Edges Slow Walk, etc. if not real)  
3. Create only real events with accurate dates/locations/images  
4. Do **not** run `seed` / demo-catalog scripts against production  
5. Wait ~1 minute, hard-refresh `/events` and Academy gatherings blocks  

Academy “FEATURED PROGRAM” / workshop cards pull from **Courses** + related **Events** CMS — not from Instagram.

---

## Phase 6 — Academy page feedback (Oumou)

From WhatsApp / site notes (do in this order):

### 6.1 Content policy (now)
- Showcase **real workshops** (e.g. bike festival) with photos + short copy  
- Do **not** require full module trees on the public site yet (Skool / external ok for deep curriculum)  
- Featured block must use **site theme** (navy/lime/cream/coral) — **not** black/white orphan styling  

### 6.2 Layout
1. Move the strongest “featured workshop / past workshop” block **above** “Future programs” if she wants booking-first storytelling  
2. Keep blue/green for primary bands; alternate cream for lists; put denser/past content lower  
3. Wire CMS images: Course/Event media fields → Media collection (after Phase 3 works)

### 6.3 Editor workflow she needs
- Change **text** in Admin (Courses / Events / Pages)  
- Change **images** via Media upload, then attach to Course/Event  
- Section order is **code/layout** today (not drag-and-drop) — developers reorder; document that honestly until a page-builder exists  

---

## Phase 7 — Deploy discipline

1. Develop on a branch / local with staging DB when possible  
2. Merge to **`main`** → SIFE Hobby Production auto-build  
3. Confirm Deployments list shows new commit **Ready** on team **Sport Is For Everyone Hobby**  
4. Smoke test:
   - `/` loads  
   - `/admin` login  
   - `/api/media?limit=1` returns docs  
   - Create one Media upload → Blob URL  
   - `/events` shows only real events  
   - Instagram strip shows images  
5. Never deploy production from the GIHOZO duplicate project  

---

## Phase 8 — Optional hardening (later)

- SPF + DMARC TXT for `sportisforeveryone.org` (email trust)  
- Confirm `api.` hostname purpose or remove  
- Re-enable Payload `imageSizes` **after** DB push  
- Monitor Blob usage in Vercel Storage  
- Instagram sync cron (`/api/instagram/sync`) if CMS mirror of Graph is desired  
- Academy Skool deep-link CTAs instead of unfinished module UX  

---

## Phase 9 — Checklist (print / tick)

### Infra
- [ ] Hover NS → Cloudflare for `sportisforeveryone.org` only  
- [ ] Apex + www **DNS only** to Vercel  
- [ ] Cloudflare zone Active  
- [ ] Working in Vercel team **Sport Is For Everyone Hobby**  

### Env / Blob
- [ ] `NEXT_PUBLIC_SITE_URL=https://sportisforeveryone.org`  
- [ ] `BLOB_READ_WRITE_TOKEN` present on Production  
- [ ] Fresh Production deploy **Ready** after env change  

### CMS
- [ ] `/api/media` healthy; Media list shows rows  
- [ ] New upload lands on Blob URL  
- [ ] Understand Instagram: Graph token vs CMS vs seed  
- [ ] Seed events removed / unpublished  
- [ ] Real workshop photos attached for Academy featured  

### Design feedback
- [ ] Academy featured uses brand colors (no B/W mismatch)  
- [ ] Featured / workshop storytelling above empty “future” filler if requested  
- [ ] Oumou can edit text; images via Media  

### Do not
- [ ] Share Vercel email verification codes  
- [ ] Orange-cloud the Vercel A/CNAME  
- [ ] Seed production DB casually  
- [ ] Deploy from GIHOZO “sport-is-for-everyone” clone  

---

## Quick answers

**Q: Media page blank?**  
A: Almost always `/api/media` 500 or session issue. Fix API/schema/Blob first; then hard-refresh admin.

**Q: Where are Instagram posts stored?**  
A: Prefer live Graph API when token set; else CMS `instagram-posts`; else repo seed stills. Admin list empty ≠ homepage empty.

**Q: Do I need manual Redeploy?**  
A: Prefer Git push to `main`. Manual Redeploy is optional and may require a private email code — keep that code to yourself.

**Q: How do I reorder sections?**  
A: Not in Payload UI yet — ask engineering to change page composition; editors change content/images inside each section.
