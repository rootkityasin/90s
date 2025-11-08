# How to Find Your Cloudinary Credentials

1. **Log in** at https://cloudinary.com/console (create a free account if needed).
2. On the dashboard, locate the **Account Details** card. It lists:
   - `Cloud name`
   - `API Key`
   - `API Secret` (click the eye icon to reveal before copying)
3. If the card is hidden, go to **Settings → Account → API Credentials** for the same values.
4. Paste the keys into `.env.local`:

   ```bash
   CLOUDINARY_CLOUD_NAME="dxyz123"
   CLOUDINARY_API_KEY="123456789012345"
   CLOUDINARY_API_SECRET="AbCdEfGhIjKlMnOpQrStUvWxYz"
   ```

## Tips
- Keep the surrounding quotes when updating `.env.local`.
- Never share the API secret in screenshots or commit history.
- If you regenerate the secret, update both local and Vercel environments.
- Your cloud name also appears in the console URL: `https://cloudinary.com/console/c-<cloud-name>`.

## Verification
Run `node scripts/testCloudinary.mjs` to validate the values. A successful ping prints `Cloudinary is ready to use!`.
