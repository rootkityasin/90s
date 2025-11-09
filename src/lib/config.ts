// Central place for contact & social configuration

// Read from environment variables, with fallback to the original hardcoded values for local development.
// On Render, you will set these environment variables in the dashboard.
const RAW_WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '+8801710074092';

const normalizedWhatsApp = (() => {
	const digits = RAW_WHATSAPP_PHONE.replace(/\D/g, '');
	if (!digits) return '8801710074092';
	if (digits.startsWith('880')) return digits;
	if (digits.startsWith('0')) return `88${digits.slice(1)}`;
	return digits;
})();

export const WHATSAPP_PHONE = RAW_WHATSAPP_PHONE;
export const WHATSAPP_PHONE_E164 = normalizedWhatsApp;
export const WHATSAPP_WA_LINK = `https://wa.me/${normalizedWhatsApp}`;

export const FACEBOOK_PAGE_URL = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL || 'https://www.facebook.com/90s.legacyy';
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/90s_legacyy?igsh=bWRjODkyb2ExdXM1';
