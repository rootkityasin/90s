# Vercel Deployment Guide

Use this checklist whenever you promote a new build to Vercel. It covers environment variables, health checks, and common diagnostics.

## 1. Configure Environment Variables
Navigate to **Vercel → Project → Settings → Environment Variables** and add the following for **Production**, **Preview**, and **Development**:

| Key | Example Value | Notes |
| --- | --- | --- |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/90s-store?retryWrites=true&w=majority` | Required for MongoDB Atlas |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud` | Media uploads |
| `CLOUDINARY_API_KEY` | `123456789012345` | Media uploads |
| `CLOUDINARY_API_SECRET` | `AbCdEfGhIjKlMnOpQrStUvWxYz` | Keep secret |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Used for callback URLs |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | `8801XXXXXXX` | Optional marketing contact |
| `CLIENT_ACCESS_PASSWORD` | `choose-a-strong-passcode` | Optional override for client gate |
| `BKASH_*` | (sandbox or production values) | Only if payments are enabled |

Update values whenever credentials rotate. After adding or editing variables, click **Save** and **Redeploy**.

## 2. Redeploy the Application
1. Open the **Deployments** tab.
2. Redeploy the latest commit (••• → Redeploy) or trigger a new build via git push.
3. Wait for the build to finish and confirm no errors appear in the deployment logs.

## 3. Run Post-Deploy Smoke Tests
- Visit `/api/health` – expect `{ mongodb: true, cloudinary: true }` along with environment metadata.
- Visit `/api/test-cloudinary` – expect `{ status: "ok" }`.
- Open `/admin` and perform a test product edit. Confirm `/retail` and `/client/catalog` update without a manual refresh.
- If payments are enabled, hit `/api/payment/bkash/create` with sandbox data to confirm credentials were applied.

## 4. Troubleshooting
- **Missing environment variables** – Deployment logs show `Process env missing`. Re-check Vercel settings and redeploy.
- **Cloudinary errors** – `/api/test-cloudinary` returns failure. Confirm keys and that Cloudinary account is active.
- **MongoDB errors** – `/api/health` reports `mongodb: false`. Ensure IP allowlist includes Vercel or that the connection string is correct.
- **Realtime updates not working** – Make sure the deployment uses the latest `realtime.ts`. Restart the deployment if SSE clients are stuck.

## 5. Deployment Hygiene
- Tag releases in git so you can track which build is live.
- Keep `.env.local` synced with Vercel to avoid “works locally” surprises.
- Review Vercel Analytics or Speed Insights for regressions after major UI changes.

Following this guide ensures every deployment has the credentials it needs, surfaces health issues immediately, and keeps the storefront responsive across environments.
