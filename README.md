# Dz Store — Demo

Simple e-commerce demo built with React + Vite.

## Getting Started

### Prerequisites
- Node.js 18+

### Installation
```bash
npm install
```

### Run locally
```bash
npm run dev
```
Open http://localhost:5173

### Build
```bash
npm run build
```
Output in `dist/` — deploy to Vercel, Netlify, or Railway.

## Seller dashboard

Visit `/admin`. The default password is `admin123` — override it at build time:

```bash
echo 'VITE_ADMIN_PASSWORD=your-password' > .env.local
```

The login hint on screen disappears once you set your own password.

> This gate is **client-side only** — the password ships in the JS bundle and the
> session flag lives in `localStorage`, so anyone can bypass it with devtools.
> It keeps the dashboard out of a casual visitor's way; it is not real access
> control. Put an authenticated backend in front of it before handling real orders.

## Notes
- Demo uses `localStorage` for data (browser-only storage).
- Data is per-browser/per-device and not shared across devices.
- Uploaded product images are downscaled to 900px JPEG before being stored, because
  `localStorage` caps at roughly 5MB and base64 inflates size by about a third.
  If storage does fill up, saving reports an error instead of silently discarding.
- Stock is deducted when an order is placed and returned if the order is canceled.
- For production with multiple users, use a centralized database (e.g. Supabase) instead of `localStorage`.

## Deployment
Works with any static host. SPA deep links (`/admin/login`) are handled by
`public/_redirects` (Netlify) and the `rewrites` entry in `vercel.json` (Vercel).
For Railway, build command is `npm run build` and start command is `npm start`.
