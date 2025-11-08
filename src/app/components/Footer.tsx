"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WHATSAPP_PHONE, WHATSAPP_WA_LINK, FACEBOOK_PAGE_URL, INSTAGRAM_URL } from '../../lib/config';
// Reuse same SVG icons as hero for consistency
const icons = {
  whatsapp: (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true"><path fill="currentColor" d="M17.47 14.37c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.06-.29-.15-1.24-.46-2.37-1.47-.88-.78-1.47-1.74-1.64-2.03-.17-.29-.02-.45.13-.6.14-.14.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.06-.15-.64-1.55-.88-2.13-.23-.56-.47-.49-.64-.5-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.82 1.18 3.01.15.19 2.03 3.09 4.93 4.34.69.3 1.23.48 1.65.62.69.22 1.32.19 1.82.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z"/></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true"><path fill="currentColor" d="M13.5 22v-8.21h2.75l.41-3.2H13.5V8.26c0-.93.26-1.56 1.6-1.56h1.71V3.83c-.3-.04-1.34-.13-2.55-.13-2.53 0-4.26 1.54-4.26 4.37v2.44H7v3.2h3.01V22h3.49Z"/></svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true"><path fill="currentColor" d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10Zm-5 2.5A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 12 17.5 5.5 5.5 0 0 0 17.5 12 5.5 5.5 0 0 0 12 6.5Zm0 2A3.5 3.5 0 0 1 15.5 12 3.5 3.5 0 0 1 12 15.5 3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm4.75-3.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>
  )
};

export default function Footer({ role, clientAccess }: { role?: string; clientAccess?: boolean }) {
  const year = new Date().getFullYear();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [categoryTree, setCategoryTree] = React.useState<Record<string, string[]>>({});
  
  const pathname = usePathname();
  const inClientMode = pathname.startsWith('/client') || role === 'client' || clientAccess;
  const targetBase = inClientMode ? 'client' : 'retail';

  React.useEffect(() => {
    let cancelled = false;
    async function fetchCategories() {
      try {
        const endpoint = targetBase === 'client' ? '/api/client/products' : '/api/retail/products';
        const res = await fetch(endpoint, { cache: 'no-store' });
        const data = await res.json();
        if (!data?.success) return;
        const products: any[] = Array.isArray(data.products) ? data.products : [];

        const categoriesList: string[] = Array.isArray(data.categories) && data.categories.length
          ? (data.categories as string[]).slice().sort((a, b) => a.localeCompare(b))
          : Array.from(new Set(products.map((p: any) => p?.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));

        const treeRaw: Record<string, string[]> = data.categoryTree && typeof data.categoryTree === 'object'
          ? Object.fromEntries(Object.entries(data.categoryTree).map(([key, value]) => [key, Array.isArray(value) ? (value as string[]).slice().sort((a, b) => a.localeCompare(b)) : []]))
          : (() => {
              const map: Record<string, string[]> = {};
              products.forEach((p) => {
                if (!p?.category) return;
                if (!map[p.category]) map[p.category] = [];
                if (p.subCategory && !map[p.category].includes(p.subCategory)) {
                  map[p.category].push(p.subCategory);
                }
              });
              Object.keys(map).forEach((key) => {
                map[key] = map[key].slice().sort((a, b) => a.localeCompare(b));
              });
              return map;
            })();

        const tree: Record<string, string[]> = { ...treeRaw };
        categoriesList.forEach((cat) => {
          if (!tree[cat]) tree[cat] = [];
        });

        if (!cancelled) {
          setCategories(categoriesList);
          setCategoryTree(tree);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch categories:', error);
        }
      }
    }
    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, [targetBase]);
  const shopHref = inClientMode ? '/client/catalog' : '/retail';
  const searchHref = inClientMode ? '/client/search' : '/search';
  const categoryBase = inClientMode ? '/client/catalog' : '/retail';
  const aboutHref = inClientMode ? '/client/about' : '/about';
  const contactHref = inClientMode ? '/client/contact' : '/contact';

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3 className="footer-logo">90&apos;s Legacy</h3>
          <p className="footer-tag">Curating vintage-inspired 90s pieces.</p>
          <div className="footer-social" style={{ gap: '.55rem' }}>
            <a href={`${WHATSAPP_WA_LINK}?text=Hi%20I%20want%20to%20discuss%20sourcing`} aria-label="WhatsApp" target="_blank" rel="noreferrer" className="social-icon" title="WhatsApp">{icons.whatsapp}</a>
            <a href={FACEBOOK_PAGE_URL} aria-label="Facebook" target="_blank" rel="noreferrer" className="social-icon" title="Facebook">{icons.facebook}</a>
            <a href={INSTAGRAM_URL} aria-label="Instagram" target="_blank" rel="noreferrer" className="social-icon" title="Instagram">{icons.instagram}</a>
          </div>
        </div>

        <nav className="footer-block">
          <h4 className="footer-head">Navigate</h4>
          <ul>
            <li><Link href={shopHref}>Shop</Link></li>
            <li><Link href={aboutHref}>About</Link></li>
            <li><Link href={contactHref}>Contact</Link></li>
            <li><Link href={searchHref}>Search</Link></li>
          </ul>
        </nav>

        <div className="footer-block">
          <h4 className="footer-head">Categories</h4>
          <ul>
            {categories.slice(0,8).map(c=> (
              <li key={c}>
                <Link href={`${categoryBase}?category=${encodeURIComponent(c)}`}>{c}</Link>
                {categoryTree[c]?.length ? (
                  <ul className="footer-sublist">
                    {categoryTree[c].slice(0,3).map(sub => (
                      <li key={sub}>
                        <Link href={`${categoryBase}?category=${encodeURIComponent(c)}&subCategory=${encodeURIComponent(sub)}`}>{sub}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-block">
          <h4 className="footer-head">Info</h4>
          <ul>
            <li><Link href="/policy">Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div className="footer-block">
          <h4 className="footer-head">Contact</h4>
          <ul>
            <li><a href={`${WHATSAPP_WA_LINK}?text=Hi%20I%20want%20to%20discuss%20sourcing`} target="_blank" rel="noreferrer">WhatsApp: {WHATSAPP_PHONE}</a></li>
            <li><a href={FACEBOOK_PAGE_URL} target="_blank" rel="noreferrer">Facebook Page</a></li>
            <li><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <small>© {year} 90&apos;s Legacy. All rights reserved.</small>
      </div>
    </footer>
  );
}
