# PlanetScale Setup (Optional)

MongoDB Atlas is the production datastore for this project. Use PlanetScale only if you plan to migrate to a relational model (MySQL) with Prisma or a custom data layer. This guide captures the high-level steps so the option remains documented.

## When to Choose PlanetScale
- You need relational joins, referential integrity, or complex reporting.
- You want branch-based schema workflows and deploy requests.
- Your platform engineering stack standardizes on MySQL.

## 1. Create the Database
1. Sign up at https://planetscale.com with GitHub (free tier includes 5 GB storage).
2. Click **Create database**, pick a name (e.g. `90s-store`), choose the nearest region, and confirm.

## 2. Generate Credentials
1. Open the database → **Connect**.
2. Choose the **General → mysql** connection format for use with Prisma or the Node driver.
3. Copy the `mysql://` connection string; it contains a temporary password. Generate a new password if the first one expires.

## 3. Configure Environment Variables

```bash
DATABASE_URL="mysql://USERNAME:PASSWORD@HOST/DB_NAME?sslaccept=strict"
```

- Add the same key in Vercel (Production, Preview, Development).
- Keep `.env.local` out of version control.

## 4. Schema & Migration Strategy
- Introduce Prisma (or another ORM) to model `products`, `variants`, `sales`, etc.
- Use PlanetScale branches to apply schema changes without downtime.
- Seed data using a Prisma seed script or custom SQL fixtures instead of `src/lib/data/initDb.ts` (that script targets MongoDB).

## 5. Application Changes Required
- Replace calls in `src/lib/data/mongoStore.ts` with MySQL-backed repositories (create `planetscaleStore.ts`).
- Update `src/lib/data/store.ts` to export the new repository.
- Revisit indexes, filters, and SSE broadcast payloads to ensure compatibility.

## 6. Testing & Rollout Checklist
- ✅ Run Prisma migrations or SQL DDL on a staging branch.
- ✅ Execute integration tests against PlanetScale (CRUD + category filters + SSE feeds).
- ✅ Verify admin, retail, and client endpoints operate on the new backing store.
- ✅ Validate health checks and analytics charts use the new data source.

## Troubleshooting
- **Authentication errors** – Regenerate a password from the PlanetScale dashboard and update `DATABASE_URL` everywhere.
- **SSL issues** – Ensure `sslaccept=strict` (or equivalent) remains in the connection string.
- **Missing tables** – Confirm migrations ran; PlanetScale does not create schemas automatically.
- **Stale data** – Revisit caching layers or revalidation calls once Prisma replaces the Mongo helpers.

---

If you decide to move forward with PlanetScale, plan the migration as a dedicated milestone: freeze writes, export MongoDB, transform data to relational form, import into MySQL, run validation checks, then switch `store.ts` to the new adapters. Document the cutover thoroughly so the team can roll back if needed.
