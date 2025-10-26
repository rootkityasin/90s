# MongoDB Atlas Setup (512MB Free Forever)

## Step 1: Create MongoDB Atlas Account (3 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or GitHub (free)
3. Click **"Build a Database"**
4. Choose **"M0 FREE"** tier
   - ✅ 512MB storage
   - ✅ Shared RAM
   - ✅ Free forever, no credit card required
5. Choose **AWS** and closest region to you
6. Name your cluster: `90s-store` (or any name)
7. Click **"Create"**

## Step 2: Create Database User

1. On the "Security Quickstart" page:
   - Username: `admin` (or any username)
   - Password: Click "Autogenerate" or create your own
   - **⚠️ SAVE THIS PASSWORD!**
2. Click **"Create User"**

## Step 3: Allow Network Access

1. On "Network Access" page:
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (for development)
   - Or add your specific IP address
2. Click **"Confirm"**

## Step 4: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Replace `/?retryWrites` with `/90s-store?retryWrites` to specify database name

**Final connection string should look like:**
```
mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/90s-store?retryWrites=true&w=majority
```

## Step 5: Add to Environment Variables

Create/update `.env.local` file in project root:

```env
MONGODB_URI="mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/90s-store?retryWrites=true&w=majority"
```

**⚠️ Important**: Add `.env.local` to `.gitignore` (already done)

## Step 6: Initialize Database

Run this command to create collections and seed data:

```powershell
npx tsx src/lib/data/initDb.ts
```

This will:
- ✅ Create `products` collection
- ✅ Create `sales` collection  
- ✅ Seed initial products from manifest
- ✅ Seed 14 days of sales data
- ✅ Create indexes for performance

## Step 7: Start Dev Server

```powershell
npm run dev
```

## Step 8: Deploy to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - Name: `MONGODB_URI`
   - Value: Your full connection string
3. Click **"Save"**
4. Redeploy your app

## What You Get (FREE Forever)

- ✅ **512MB storage** (enough for 1000+ products with images)
- ✅ **Persistent data** (survives deployments)
- ✅ **Works on localhost AND Vercel**
- ✅ **You already know MongoDB**
- ✅ **No credit card required**
- ✅ **Never expires**

## Testing

After setup, test in admin:
1. Add new product
2. Edit product
3. Refresh page → **Data persists!** 🎉
4. Deploy to Vercel → **Still there!** 🚀

## Troubleshooting

**Error: MONGODB_URI not set**
- Make sure `.env.local` exists with `MONGODB_URI`
- Restart dev server: `npm run dev`

**Error: Authentication failed**
- Verify password in connection string is correct
- Check database user was created properly

**Error: Connection timeout**
- Verify IP address is whitelisted (0.0.0.0/0 for anywhere)
- Check MongoDB cluster is running

**Need help?**
Check: https://www.mongodb.com/docs/atlas/getting-started/

---

## Why MongoDB Atlas?

### Before (In-memory)
- ❌ Data resets on Vercel deployments
- ❌ No persistence
- ❌ Lost all changes on refresh

### After (MongoDB Atlas)
- ✅ Data persists permanently
- ✅ Works on localhost AND Vercel
- ✅ 512MB free storage forever
- ✅ You already know MongoDB
- ✅ Production-ready
- ✅ No learning curve for you!
