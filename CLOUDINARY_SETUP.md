# Cloudinary Setup Guide

## ✅ Installation Complete!
Cloudinary has been integrated into your project.

## 📝 Next Steps:

### 1. Create Cloudinary Account (Free)
   - Go to: https://cloudinary.com/users/register_free
   - Sign up with email
   - Verify your email
   - Login to dashboard

### 2. Get Your Credentials
   After logging in to Cloudinary:
   
   1. You'll see the Dashboard
   2. Find these values in the "Account Details" section:
      - **Cloud Name**: (e.g., "dxxxxx")
      - **API Key**: (e.g., "123456789012345")
      - **API Secret**: (e.g., "AbCdEfGhIjKlMnOpQrStUvWxYz")

### 3. Add Credentials to .env.local
   Open `G:\90s\.env.local` and replace:
   
   ```bash
   CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
   CLOUDINARY_API_KEY="your_api_key_here"
   CLOUDINARY_API_SECRET="your_api_secret_here"
   ```
   
   With your actual values:
   
   ```bash
   CLOUDINARY_CLOUD_NAME="dxxxxx"
   CLOUDINARY_API_KEY="123456789012345"
   CLOUDINARY_API_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz"
   ```

### 4. Restart Dev Server
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

### 5. Test Image Upload
   1. Go to http://localhost:3001/admin
   2. Click "Add Product"
   3. Click "Upload Images"
   4. Select an image
   5. Image will upload to Cloudinary ✅

## 🎯 What Changed:

### Before (Local Storage) ❌:
- Images saved in `public/uploads/`
- Lost on Vercel deployment
- Not backed up

### After (Cloudinary) ✅:
- Images uploaded to Cloudinary CDN
- Automatically optimized (WebP, quality)
- Globally distributed (fast loading)
- Permanent storage (won't be deleted)
- Works perfectly on Vercel

## 📊 Free Tier Limits:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ 25,000 transformations/month
- ✅ More than enough for your store!

## 🔐 Security:
- API credentials in `.env.local` (not committed to Git)
- Server-side only (credentials never exposed to browser)
- Secure HTTPS upload

## 🌐 For Vercel Deployment:
Add these environment variables in Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## 📝 Image URLs in MongoDB:
Instead of:
```
/uploads/1234567890-product.jpg
```

You'll now store:
```
https://res.cloudinary.com/your-cloud/image/upload/v1234567890/90s-store/products/abc123.jpg
```

## 🎨 Automatic Features:
- ✅ Image resize (max 1200x1200)
- ✅ Quality optimization
- ✅ Format conversion (WebP for modern browsers)
- ✅ Organized in folder: `90s-store/products/`

Ready to use once you add your credentials!
