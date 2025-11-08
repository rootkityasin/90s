# MongoDB Atlas Setup (M0 Free Tier)

MongoDB Atlas provides a managed replica set that keeps catalog data persistent across deployments. The project automatically falls back to `mongodb://localhost:27017/90s-store` if `MONGODB_URI` is missing, but Atlas is recommended.

## 1. Create the Cluster
1. Visit https://www.mongodb.com/cloud/atlas/register and sign in (Google/GitHub works).
2. Choose **Build a Database → Shared → M0** (512 MB storage, shared RAM, no credit card).
3. Select AWS and the closest region.
4. Name the cluster `90s-store` (any name is fine) and create it.

## 2. Create a Database User
1. From **Security Quickstart**, add a user (e.g. `admin`).
2. Generate or define a strong password and store it securely.

## 3. Allow Network Access
- During setup, choose **Add My Current IP** or allow `0.0.0.0/0` for development.
- You can tighten this later inside **Network Access**.

## 4. Copy the Connection String
1. Click **Connect → Connect your application**.
2. Pick the Node.js driver (v4+), copy the URI, and replace the password placeholder.
3. Append the database name so Atlas creates it automatically:

   ```text
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/90s-store?retryWrites=true&w=majority
   ```

## 5. Update `.env.local`

```bash
MONGODB_URI="mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/90s-store?retryWrites=true&w=majority"
```

Restart any running dev server after changing environment variables.

## 6. Seed the Database

```powershell
npx tsx src/lib/data/initDb.ts
```

The script ensures the following collections exist:
- `products` seeded from the manifest with retail defaults
- `sales` seeded with 14 days of demo analytics
- Indexes on `slug`, `category`, `productCode`, and `base`

You can rerun the script safely; it skips seeding when data already exists.

## 7. Run the App

```powershell
npm run dev
```

Visit `http://localhost:3000/admin` to create or edit products, then refresh `/retail` and `/client/catalog` to confirm persistence.

## 8. Configure Vercel
1. Go to **Vercel → Project → Settings → Environment Variables**.
2. Add `MONGODB_URI` with the same connection string for Production, Preview, and Development.
3. Redeploy; the health check at `/api/health` should report `mongodb: true`.

## Troubleshooting
- **Connection refused / timeout** – Confirm the IP address is allowed and the cluster is in the `Ready` state.
- **Authentication failed** – Re-copy the password, ensure special characters are URL encoded, or regenerate the user.
- **No data after seeding** – Check the script output; if errors occur, delete the empty collections in Atlas and rerun.

## Why Atlas?
- Persistent storage that survives Vercel deploys
- Shared free tier sufficient for thousands of SKUs
- Automatic backups and monitoring dashboards
- Native driver works with Edge-friendly Next.js server actions
