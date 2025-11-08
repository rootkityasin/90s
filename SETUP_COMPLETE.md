# ✅ Setup Snapshot

MongoDB Atlas, Cloudinary, and the realtime admin workflow are now wired into the project. Use this page as a quick reference for what changed and what to verify after cloning or deploying.

## Key Updates
- `src/lib/data/mongoStore.ts` – Primary data access layer backed by MongoDB Atlas (seed + index creation).
- `src/lib/data/store.ts` – Exports Mongo helpers to server actions and API routes.
- `src/app/admin/actions.ts` – Server actions call Mongo directly and broadcast SSE updates.
- `src/app/api/*` – Retail, client, and admin endpoints forward to the same Mongo helpers.
- `src/lib/realtime.ts` – SSE hub streams create/update/delete events to storefronts.
- `next.config.mjs` – Ensures MongoDB driver stays server-side only.

## Quick Start Checklist
1. Copy `.env.example` to `.env.local` and fill out MongoDB + Cloudinary credentials.
2. Run `npx tsx src/lib/data/initDb.ts` to seed products and analytics snapshots.
3. Start the dev server with `npm run dev` and visit:
	- `/retail` – Retail storefront with pricing
	- `/client` → enter password (default `sweetclient`) → `/client/catalog`
	- `/admin` – Admin dashboard and product CRUD
4. Create a product and confirm it appears on `/retail` and `/client/catalog` without refresh (SSE check).
5. Deploy to Vercel, replicate environment variables, and hit `/api/health` + `/api/test-cloudinary` on the deployed URL.

## Environment Variables to Verify
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_PHONE`, socials (optional)
- `CLIENT_ACCESS_PASSWORD` (optional override)
- `BKASH_*` (payments only)

## Validation Steps
- ✅ Admin CRUD works end-to-end (create/edit/delete) with persistence in Mongo.
- ✅ Realtime events reach both retail and client catalogs.
- ✅ `/api/health` returns `{ mongodb: true, cloudinary: true }`.
- ✅ `/api/test-cloudinary` returns `{ status: "ok" }`.
- ✅ Lighthouse / Web Vitals within expected range after deployment.

## Optional Next Moves
- Consult `PLANETSCALE_SETUP.md` if you decide to migrate to MySQL/PlanetScale in a future phase.
- Follow `BKASH_INTEGRATION_GUIDE.md` once payment processing moves from blueprint to implementation.
- Harden authentication by adding an admin auth layer (NextAuth, Clerk, etc.) before inviting external collaborators.
