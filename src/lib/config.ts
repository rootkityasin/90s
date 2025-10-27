// Central place for contact & social configuration

// Read from environment variables, with fallback to the original hardcoded values for local development.
// On Render, you will set these environment variables in the dashboard.
export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '8801710074092';
export const FACEBOOK_PAGE_URL = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL || 'https://www.facebook.com/90s.legacyy';
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/90s_legacyy?igsh=bWRjODkyb2ExdXM1';
