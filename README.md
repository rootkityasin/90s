# 90's Commerce

Production-ready Next.js 14 build for 90's Legacy. The app delivers a role-aware commerce experience with separate retail and client-facing catalogs, a real-time admin console, persistent MongoDB storage, and Cloudinary-backed media delivery. Admin changes stream instantly to storefronts through Server-Sent Events.

## Highlights
- Dual catalog strategy: retail shoppers see pricing, while client partners unlock tokenized SKUs after passing the gated login.
- Admin dashboard with product CRUD, automated slug generation, catalog health metrics, and realtime updates broadcast over SSE.
- MongoDB Atlas datastore seeded from a manifest with repeatable script, plus category/subcategory facets and SKU-based lookups.
- Cloudinary asset pipeline with direct uploads, CDN delivery, and automated optimization for all product media.
- Payment integration blueprint for bKash, including credential management, secure API patterns, and sandbox-to-production checklist.

## Tech Stack
- Next.js 14 App Router, React 18, TypeScript
- MongoDB Atlas via native driver and seed manifest
- Cloudinary v2 SDK for asset management
- Framer Motion, Lottie, and custom design system for interactions
- Server Actions + REST API routes + Server-Sent Events for data flow
- Vercel-ready deployment (edge-friendly middleware, environment-driven config)

## Prerequisites
- Node.js 18.17+ and npm 9+
- MongoDB Atlas cluster (M0 free tier works)
- Cloudinary account (free tier is sufficient)
- bKash sandbox credentials (optional, for payments)

## Environment Variables
Create `.env.local` from `.env.example` and provide the values below.

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string (includes database name) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud identifier for uploads |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key for server-side uploads |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret (keep private) |
| `NEXT_PUBLIC_SITE_URL` | optional | Absolute site URL used in sharing metadata |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | optional | Phone number prefilled for WhatsApp inquiries |
| `NEXT_PUBLIC_FACEBOOK_PAGE_URL` | optional | Facebook link surfaced in footers |
| `NEXT_PUBLIC_INSTAGRAM_URL` | optional | Instagram link surfaced in footers |
| `CLIENT_ACCESS_PASSWORD` | optional | Overrides default client-gate password (`sweetclient`) |
| `WHATSAPP_PHONE` | deprecated | Use `NEXT_PUBLIC_WHATSAPP_PHONE` instead |
| `BKASH_*` | optional | Only needed when enabling bKash payments (see payment docs) |
| `JWT_SECRET`, `PAYMENT_TIMEOUT_MINUTES`, `MAX_PAYMENT_AMOUNT`, `RATE_LIMIT_*` | optional | Security knobs for bKash integration |

> Never commit `.env.local`. Configure the same keys on Vercel for Production, Preview, and Development environments before deploying.

## Quick Start
```powershell
npm install
cp .env.example .env.local
# Fill in credentials, then seed data
npx tsx src/lib/data/initDb.ts
npm run dev
```

Visit `http://localhost:3000`:
- `/retail` – public retail storefront with pricing
- `/client` – gated client landing (enter shared password)
- `/client/catalog` – client catalog with tokenized SKUs after authentication
- `/admin` – admin console (product CRUD, metrics, live feed)

If port 3000 is taken, Next.js automatically selects the next available port; update `NEXT_PUBLIC_SITE_URL` accordingly when that happens.

## Available Scripts
- `npm run dev` – Start local development server (watch mode)
- `npm run build` – Create optimized production build
- `npm run start` – Serve the production build
- `npm run lint` – Run ESLint with Next.js defaults
- `npx tsx src/lib/data/initDb.ts` – Seed MongoDB with manifest data and demo sales snapshots

## Data & Media Flow
- Catalog data persists in MongoDB (`src/lib/data/mongoStore.ts`) with category indexes, SKU lookups, and update timestamps.
- Server actions call MongoDB helpers directly to avoid serverless fetch loops, then broadcast changes via `src/lib/realtime.ts`.
- REST API routes under `src/app/api/*` expose the same operations for programmatic access (see `API_DOCUMENTATION.md`).
- Product media uploads go through `/api/upload-image`, which streams files to Cloudinary and stores returned URLs in MongoDB.

## Real-Time Updates
Clients subscribe to `/api/realtime-products`. The SSE hub pushes:
- `snapshot` – initial product list
- `productUpdate` – newly created or edited product payloads
- `productDelete` – product removals (identified by `productCode`)
- `ping` – keepalives every 25 seconds

## Documentation Index
- `API_DOCUMENTATION.md` – Full REST and SSE API reference
- `MONGODB_SETUP.md` – Atlas configuration and seeding workflow
- `CLOUDINARY_SETUP.md` & `HOW_TO_FIND_CLOUDINARY_CREDENTIALS.md` – Media pipeline setup
- `BKASH_INTEGRATION_GUIDE.md` & `PAYMENT_QUICKSTART.md` – Payment blueprint
- `VERCEL_DEPLOYMENT.md` – Production checklist for environment variables, health checks, and redeploys
- `SERVER_ACTIONS_FIX.md` – Notes on avoiding self-fetch loops inside server actions
- `PLANETSCALE_SETUP.md` – Optional alternative if migrating to MySQL

## Deployment Notes
1. Configure environment variables in Vercel (Production, Preview, Development).
2. Push to your main branch – Vercel builds with `npm install`, `npm run build`.
3. Use `/api/health` on each deployment to confirm MongoDB and Cloudinary connectivity.
4. Use `/api/test-cloudinary` to validate Cloudinary credentials after redeploying.

## Testing & Monitoring
- Run `npm run lint` before committing to catch regressions early.
- Manual smoke tests: create/edit/delete product in `/admin`, verify updates on `/retail` and `/client/catalog` without refresh.
- Payment sandbox: follow `BKASH_INTEGRATION_GUIDE.md` to exercise the full flow before enabling live credentials.

## License
All project assets and source code remain proprietary to 90's Legacy. Reach out to the team before reusing outside the brand.
