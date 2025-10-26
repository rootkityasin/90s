# How to Find Cloudinary Credentials

## Step-by-Step Guide:

### 1. Sign Up / Login to Cloudinary

Go to: **https://cloudinary.com/users/login**

- If you don't have an account: Click "Sign up" (free)
- If you have an account: Login with your email

---

### 2. You'll Land on the Dashboard

After login, you'll see the **Dashboard** page automatically.

---

### 3. Find "Account Details" Section

On the Dashboard page, look for a box/card labeled:

```
📦 Account Details
```

or 

```
🔑 API Credentials
```

It's usually in the **top section** of the dashboard.

---

### 4. Copy These Three Values:

You'll see something like this:

```
┌─────────────────────────────────────────┐
│  Account Details                         │
├─────────────────────────────────────────┤
│                                          │
│  Cloud name:    dxxxxxxxxxxxxx           │  ← Copy this
│                                          │
│  API Key:       123456789012345          │  ← Copy this
│                                          │
│  API Secret:    AbCdEfGhIjKlMnO...       │  ← Copy this (click "👁️ Show" button)
│                                          │
└─────────────────────────────────────────┘
```

**Important:** 
- The **API Secret** might be hidden with dots (•••••)
- Click the **"👁️ Show"** or **"Eye icon"** button next to it to reveal the full secret
- Or click **"Copy"** button to copy it directly

---

### 5. Alternative: Settings Page

If you don't see it on the Dashboard:

1. Click **"Settings"** icon (⚙️) in the top navigation
2. Click **"Account"** tab
3. Scroll to **"API Credentials"** section
4. You'll see the same three values

---

### 6. What Each Credential Looks Like:

| Credential | Example | Format |
|------------|---------|--------|
| **Cloud Name** | `dxyz123abc` | Short alphanumeric string |
| **API Key** | `123456789012345` | 15-digit number |
| **API Secret** | `AbCdEfGhIjKlMnOpQrStUvWxYz` | Long alphanumeric string |

---

### 7. Add to .env.local

Open: **G:\90s\.env.local**

Replace these lines with your actual values:

```bash
# BEFORE (placeholder):
CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"
CLOUDINARY_API_SECRET="your_api_secret_here"

# AFTER (your actual values):
CLOUDINARY_CLOUD_NAME="dxyz123abc"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz"
```

**Important:** Keep the quotes!

---

### 8. Test Your Setup

Run in terminal:
```bash
node scripts/testCloudinary.mjs
```

You should see:
```
✅ Connection successful!
✨ Cloudinary is ready to use!
```

---

## 🔒 Security Tips:

- ✅ Never commit `.env.local` to Git (already in .gitignore)
- ✅ Never share API Secret publicly
- ✅ Never paste credentials in public chat/forums
- ✅ Each team member should use their own Cloudinary account

---

## 📱 Mobile App (if you signed up on phone):

The Cloudinary mobile app might not show credentials.

**Solution:**
1. Open browser on your phone
2. Go to: https://cloudinary.com/console
3. Login
4. Tap the **menu icon** (☰)
5. Tap **"Settings"**
6. Find **"Account Details"** or **"API Credentials"**

---

## ❓ Can't Find Them?

**Try this:**

1. Go directly to: **https://cloudinary.com/console/settings/security**
2. You'll see your **API Key** and can regenerate **API Secret**
3. Your **Cloud Name** is in the URL: 
   ```
   https://cloudinary.com/console/c-XXXXXXXX
                                    ↑ This part
   ```

---

## 🎯 Quick Link:

Direct link to dashboard with credentials:
**https://cloudinary.com/console**

---

Need help? Let me know what you see on your screen!
