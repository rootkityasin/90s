# PlanetScale Database Setup (5GB Free)

## Step 1: Create PlanetScale Account

1. Go to https://planetscale.com
2. Sign up with GitHub (free)
3. Click **"Create a new database"**
4. Name: `90s-store` (or any name)
5. Region: Choose closest to you
6. Click **"Create database"**

## Step 2: Get Connection String

1. In your PlanetScale dashboard, click your database
2. Click **"Connect"**
3. Select **"@planetscale/database"** from dropdown
4. Copy the connection string (looks like: `mysql://user:pass@host/database?ssl=...`)

## Step 3: Add to Environment Variables

Create/update `.env.local` file:

```bash
DATABASE_URL="mysql://your-connection-string-here"
```

**Important**: Add `.env.local` to `.gitignore` (already done)

## Step 4: Initialize Database

Run this command to create tables and seed data:

```bash
npx tsx src/lib/data/initDb.ts
```

This will:
- ✅ Create `products` table
- ✅ Create `sales` table  
- ✅ Seed initial products from manifest
- ✅ Seed 14 days of sales data

## Step 5: Deploy to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `DATABASE_URL` = your PlanetScale connection string
3. Redeploy your app

## What You Get (FREE Forever)

- ✅ **5GB storage** (1000x more than you need)
- ✅ **1 billion row reads/month**
- ✅ **10 million row writes/month**
- ✅ Persistent data (survives deployments)
- ✅ Works on localhost AND Vercel
- ✅ No credit card required

## Testing

After setup, your products will:
- ✅ Save permanently
- ✅ Survive page refreshes
- ✅ Persist across deployments
- ✅ Work exactly the same on Vercel

## Troubleshooting

**Error: DATABASE_URL not set**
- Make sure `.env.local` exists with `DATABASE_URL`
- Restart dev server: `npm run dev`

**Error: Connection failed**
- Verify connection string is correct
- Check PlanetScale dashboard shows database as "Ready"
- Ensure you're using the `@planetscale/database` format

**Need help?**
Check: https://planetscale.com/docs/tutorials/connect-nextjs-app

---

## Comparison: Before vs After

### Before (File-based)
- ❌ Data resets on Vercel deployments
- ❌ Limited to read-only file system
- ❌ No persistence in production

### After (PlanetScale)
- ✅ Data persists permanently
- ✅ Works on localhost AND Vercel
- ✅ 5GB free storage
- ✅ Production-ready
