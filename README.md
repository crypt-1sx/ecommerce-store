# DZ Store — Algerian E-commerce Demo

React + Vite storefront for Algeria: 58 wilayas, 1,541 communes, per-wilaya shipping, COD, Supabase realtime.

## Features
- **Storefront:** responsive (phone 440px → 780px → 1120px), sticky header, trust bar, 2/3/4-col grid, product detail, order flow with human check
- **Checkout:** wilaya → filtered commune, home/desk delivery, live shipping fee (per-wilaya `home`/`desk`), breakdown `subtotal + shipping = total`
- **Stock:** client never sees quantity (only `available` / `out of stock`); admin sees stock; max 10 per order
- **Orders:** phone validation, duplicate/rate-limit protection, status workflow (`pending` → `confirmed` → `delivered` / `cancelled` with stock return)
- **Realtime DB:** Supabase (`products`, `orders`, `shipping_rates`) with localStorage fallback

## Quick Start
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

## Environment
Create `.env` (or `.env.local`):
```
VITE_SUPABASE_URL=https://YOURID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_ADMIN_PASSWORD=your-password
```
Fallback hardcoded to demo project `szyhiodfyewstrlvnlvg` if env missing. For production set vars in Vercel/Railway.

## Supabase Setup (1 min)
1. Supabase Dashboard → SQL Editor → New query → paste `supabase.sql` → Run
2. Database → Realtime → enable for `products`, `orders`
3. Table Editor verifies `products`, `orders`, `shipping_rates` seeded (3 demo products + 58 rates)

`supabase.sql` creates tables, RLS (`public all` for demo), 58 wilaya rates (avg of Yalidine/ZR etc.), and seeds. Tighten policies before production.

## Shipping Rates
Defaults avg of 7 couriers (e.g., Alger 500/250, Oran 800/500, Adrar 1300/950). Admin → `Shipping` tab edits all 58 (`home`/`desk`), `Save` upserts to `shipping_rates` (batch) + local cache, realtime pushed to all clients. `Reset` restores defaults.

Communes dataset: 1,541 communes (48+10) via `src/communes.js` (CC-BY, open-admin-data).

## Admin Dashboard
- Visit `/admin` → password (default `admin123` if not changed)
- Top bar: `Settings` (next to `Logout`)
  - **Language:** العربية / English (global)
  - **Password:** enter current + new + confirm → saves to `localStorage:dz-admin-pw`
- Tabs: `Orders` (filter pending/confirmed/cancelled/delivered, status actions), `Products` (add/edit/delete), `Shipping`
- Stats: pending/confirmed/collected/expected

> Client-side gate only — password in bundle + `localStorage` flag, bypassable via devtools. Add real auth before production.

## Deployment
- **Vercel/Netlify/Railway:** `npm run build` → `dist/`. SPA rewrites via `vercel.json` / `public/_redirects`.
- **Railway:** Build `npm run build`, Start `npm start` (serves `dist` via `vite preview`).
- **CSP:** `index.html` allows `https://*.supabase.co` + `wss://*.supabase.co` for realtime.

## Notes
- Images downscaled to 900px JPEG (~100KB) before storage (localStorage ~5MB cap, base64 +4/3).
- Quota errors surface instead of silent loss; concurrent tabs sync via `storage` event + Supabase realtime.
- For weight surcharge or courier API live quotes, extend `shipping_rates` or integrate `freeship.dzbuild.com`.
