// Central place for contact & social configuration

// Read from environment variables, with fallback to the original hardcoded values for local development.
// On Render, you will set these environment variables in the dashboard.
export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '8801644433431';
export const FACEBOOK_PAGE_URL = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL || 'https://www.facebook.com/90s.legacyy';
