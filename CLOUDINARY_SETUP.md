# Cloudinary Setup

Cloudinary handles all product media for the storefront and admin studio. Follow the checklist below to configure credentials locally and on Vercel.

## 1. Create a Cloudinary Account
- Visit https://cloudinary.com/users/register_free
- Sign up (free tier is sufficient) and verify your email
- Log in to the Console (`https://cloudinary.com/console`)

## 2. Locate Your API Credentials
On the Console dashboard you will find **Account Details** showing:
- **Cloud name** (e.g. `dxyz123`)
- **API Key** (numeric)
- **API Secret** (click the eye icon to reveal)

If the dashboard is collapsed, open **Settings → Account → API Credentials** for the same values. See `HOW_TO_FIND_CLOUDINARY_CREDENTIALS.md` for annotated screenshots.

## 3. Configure `.env.local`
Copy `.env.example` to `.env.local` and update the Cloudinary section:

```bash
CLOUDINARY_CLOUD_NAME="dxyz123"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz"
```

Keep the quotes. Never commit `.env.local`.

## 4. Restart the Dev Server
```powershell
# Stop any running process (Ctrl+C) then
npm run dev
```

Visit `http://localhost:3000/admin`, create a product, and use the **Upload images** button. Selected files upload directly to Cloudinary and the returned secure URLs are stored in MongoDB.

## 5. Validate the Integration
Two quick checks confirm everything is wired correctly:

```powershell
# Optional CLI sanity check
node scripts/testCloudinary.mjs

# API health check
curl http://localhost:3000/api/test-cloudinary
```

Expected output:
- The script prints plan usage and ends with `Cloudinary is ready to use!`
- The API responds with `{ "status": "ok" }`

## 6. Configure Vercel
For each environment (Production, Preview, Development) add the same keys in **Vercel → Project → Settings → Environment Variables**:

| Key | Value |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Your cloud name |
| `CLOUDINARY_API_KEY` | Your API key |
| `CLOUDINARY_API_SECRET` | Your API secret |

Redeploy after saving the values, then hit `/api/test-cloudinary` on the deployed URL.

## 7. How Media Is Stored
- All product uploads are created under `90s-store/products/` in Cloudinary.
- MongoDB stores the returned `secure_url`. Example:
	```text
	https://res.cloudinary.com/dxyz123/image/upload/v1710000000/90s-store/products/cargos/stone-01.jpg
	```
- Frontend components consume those URLs directly; no origin server storage is needed.

## 8. Why Cloudinary
- ✅ Persistent CDN-backed storage that survives deployments
- ✅ Automatic format conversion (WebP/AVIF), resizing, and quality tuning
- ✅ 25 GB storage + 25 GB bandwidth on the free tier—more than enough for current catalog volume
- ✅ Zero secrets in the browser (uploads run via server route `/api/upload-image`)

Once credentials are configured, no further action is required. Use the health endpoints after each deployment to ensure the environment variables were applied correctly.
