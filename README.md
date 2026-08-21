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

## Notes
- Demo uses `localStorage` for data (browser-only storage).
- Data is per-browser/per-device and not shared across devices.
- For production with multiple users, use a centralized database (e.g. Supabase) instead of `localStorage`.

## Deployment
Works with any static host. For Railway, build command is `npm run build` and start command is `npm start`.
