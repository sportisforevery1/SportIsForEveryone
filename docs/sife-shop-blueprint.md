# SIFE Shop blueprint

Working notes from [touristopia.shop](https://touristopia.shop/) (live + scrape `touristopia.shop-1786992069070`) translated into Sport is for Everyone. Do not copy Touristopia products, photos, or voice.

## What Touristopia actually is

A Berlin Shopify store for a community platform. Dark header, neon lime `#32d054` on black, centered wordmark, hamburger left, bag right. Body flips to white. Currency EUR. Ships from Germany.

### Information architecture

| Touristopia | SIFE equivalent |
|---|---|
| Home as shop landing | `/shop` — Editions landing |
| All / In-House / Collaborations | One catalog for now (`edition` field). Filter later if collabs exist |
| Artists + collab drops | Out of scope. SIFE merch is in-house Running Fist editions |
| Events + workshops as products | Keep events on `/events`. Shop is physical merch only |
| Cart drawer + cart page + checkout | Drawer + `/shop/cart` + `/shop/checkout` |
| Shipping / refund / imprint / privacy | Short shop note + existing Impressum / Privacy |
| Instagram + website in footer | Existing socials + Shop in explore |

### Page grammar to steal (structure, not copy)

1. **Announcement marquee** — repeating lime line on black.
2. **Image-first catalog** — large stills, little chrome, title + price under the photo.
3. **Quick add** — size + Add from the grid, not only from the product page.
4. **Product page** — one dominant photo, uppercase title, EUR price, short material story, size, Add.
5. **About the shop** — after the grid: why the objects exist.
6. **Bag always visible** — count in the header.

Touristopia copy we are **not** using: “souvenir shop of the future”, artist constellation, latex workshop, tourist-trap tee, Asafo pants, ceramic lamps.

## SIFE brand (logo PDF)

- Fist-as-head Running Fist: protest, togetherness, different bodies.
- Fist can sit **on top of** the wordmark like a step — merch can use the emblem alone when the name is nearby on the site.
- Duotone pairs only: Ready Red `#CE4846` + Off-white `#FAFAED`, or Bolting Blue `#3A4798` + Zingy Lime `#D2E2A8`. Black `#0A0A0A` for the site chrome.
- Type: Archivo, uppercase tracking like the rest of the site.
- Site is already black + lime. Shop stays in that cinematic register (do not switch the public site to Touristopia’s white body).

Voice: independent sport media, not a fashion house. Merch funds films, interviews, and the database. Contributions through the shop are **not tax-deductible**.

## Public routes

- `/shop` — marquee, hero, catalog grid, about, shipping note
- `/shop/[slug]` — product
- `/shop/cart` — full bag
- `/shop/checkout` — name, email, phone, shipping address
- `/shop/thanks?order=` — order number

Nav: **Shop** as a top-level item (with Events), plus bag icon. Footer explore includes Shop.

## CMS (Payload admin group `Shop`)

### Products

Catalog + inventory. Editors create/update; public reads `status = published`.

- `code` — `SIFE ED1` (title in admin)
- `title` — `Tee`
- `slug` from code
- `category` — apparel / accessory / print
- `price` — EUR
- `image` + optional gallery
- `description`
- `featured`
- `status` — draft / published / archived
- `variants[]` — `label` (XS–XL or One size), `sku`, `stock`

Sold out = every variant stock is 0. Admin manages stock by editing variants.

### Orders (sales)

Public checkout **creates**. Only logged-in admins **read/update**.

- `orderNumber` — `SIFE-1024`
- Customer + shipping fields
- `items[]` snapshots: product, code, title, size, unit price, qty
- `subtotal`, `total`
- `paymentStatus` — unpaid / paid / refunded  → **bought**
- `fulfillmentStatus` — unfulfilled / shipped / cancelled  → **shipped**
- `tracking`, `notes`, `paidAt`, `shippedAt`

Placing an order decrements variant stock. Cancelling restocks. Admin ticking **Paid** is the buy confirmation. Ticking **Shipped** is the ship confirmation.

No Stripe in v1. Checkout is a real order in the CMS; SIFE emails payment details (bank / PayPal later). The bag still “works”: stock moves, sales appear, fulfillment is tracked.

## Seed editions

Named like the request (`SIFE ED1 Tee`), not Touristopia SKUs. Photos are generated SIFE stills (do not use scraped Touristopia merch images).

| Code | Object | Pair | EUR |
|---|---|---|---|
| SIFE ED1 | Tee | Lime fist on black | 45 |
| SIFE ED2 | Hoodie | Coral fist on navy | 85 |
| SIFE ED3 | Cap | Lime fist on navy | 32 |
| SIFE ED4 | Tote | Coral fist on cream | 28 |
| SIFE ED5 | Print | Lime fist on navy | 22 |
| SIFE ED6 | Socks | Lime / navy on black | 16 |

Apparel sizes XS–XL, starting stock 8. Cap / tote / print / socks: One size, stock 12.

## Out of scope

- Stripe / Apple Pay / Shopify
- Customer accounts
- Artist collab drops
- Selling event tickets in the shop
- Using Touristopia photography or product names
