# Vercel Deployment Guide

## Image Upload Not Working on Vercel?

Your image uploads work on localhost but not on Vercel because the **Cloudinary environment variables** are not set in Vercel.

---

## Step-by-Step Fix:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project (90s)

### 2. Add Environment Variables
Go to: **Settings → Environment Variables**

Add these **4 variables**:

```
MONGODB_URI=mongodb+srv://rootkityasin:rootkityasin@cluster0.ldlhldf.mongodb.net/90s-store?retryWrites=true&w=majority&appName=Cluster0

CLOUDINARY_CLOUD_NAME=dwrmfoq1a

CLOUDINARY_API_KEY=692512442891449

CLOUDINARY_API_SECRET=B6SW8zNtn6GCj8368dYwJYWzuWY
```

**Important:** 
- Select **Production**, **Preview**, and **Development** for each variable
- Click "Save" after adding each one

### 3. Redeploy
After adding all variables:
- Go to **Deployments** tab
- Click the **3 dots** on the latest deployment
- Select **Redeploy**
- Wait for deployment to complete

---

## Verify Configuration

### Test Cloudinary Setup:
Visit: `https://your-vercel-url.vercel.app/api/test-cloudinary`

You should see:
```json
{
  "status": "ok",
  "message": "Cloudinary is properly configured"
}
```

If you see errors, the environment variables are not set correctly.

---

## How It Works

1. **Localhost**: Uses `.env.local` file (already configured)
2. **Vercel**: Uses environment variables from dashboard (needs manual setup)

Image uploads go to **Cloudinary** (not local storage), which works on Vercel's serverless platform.

---

## Need Help?

If images still don't upload after following these steps:
1. Check Vercel deployment logs
2. Visit `/api/test-cloudinary` to verify configuration
3. Ensure all 4 environment variables are set
4. Make sure you redeployed after adding variables
