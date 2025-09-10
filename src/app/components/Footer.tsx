"use client";
import React from 'react';
import Link from 'next/link';
import { listProducts } from '../../lib/data/store';
import { WHATSAPP_PHONE, FACEBOOK_PAGE_URL, INSTAGRAM_URL } from '../../lib/config';

export default function Footer() {
  const year = new Date().getFullYear();
  const categories = React.useMemo(
    () => Array.from(new Set(listProducts().map(p => p.category))).sort(),
    []
  );

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3 className="footer-logo">90&apos;s Legacy</h3>
          <p className="footer-tag">Curating vintage-inspired 90s pieces.</p>
          <div className="footer-social" style={{ gap: '.5rem' }}>
            <a href={`https://wa.me/${WHATSAPP_PHONE}?text=Hi%20I%20want%20to%20discuss%20sourcing`} aria-label="WhatsApp" target="_blank" rel="noreferrer" className="social-btn" title="WhatsApp">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M17.47 14.37c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.06-.29-.15-1.24-.46-2.37-1.47-.88-.78-1.47-1.74-1.64-2.03-.17-.29-.02-.45.13-.6.14-.14.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.06-.15-.64-1.55-.88-2.13-.23-.56-.47-.49-.64-.5-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.82 1.18 3.01.15.19 2.03 3.09 4.93 4.34.69.3 1.23.48 1.65.62.69.22 1.32.19 1.82.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z"/></svg>
            </a>
            <a href={FACEBOOK_PAGE_URL} aria-label="Facebook" target="_blank" rel="noreferrer" className="social-btn" title="Facebook">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M13.5 22v-8.21h2.75l.41-3.2H13.5V8.26c0-.93.26-1.56 1.6-1.56h1.71V3.83c-.3-.04-1.34-.13-2.55-.13-2.53 0-4.26 1.54-4.26 4.37v2.44H7v3.2h3.01V22h3.49Z"/></svg>
            </a>
            <a href={INSTAGRAM_URL} aria-label="Instagram" target="_blank" rel="noreferrer" className="social-btn" title="Instagram">
              <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10Zm-5 2.5A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 12 17.5 5.5 5.5 0 0 0 17.5 12 5.5 5.5 0 0 0 12 6.5Zm0 2A3.5 3.5 0 0 1 15.5 12 3.5 3.5 0 0 1 12 15.5 3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm4.75-3.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>
            </a>
          </div>
        </div>

        <nav className="footer-block">
          <h4 className="footer-head">Navigate</h4>
          <ul>
            <li><Link href="/retail">Shop</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/search">Search</Link></li>
          </ul>
        </nav>

        <div className="footer-block">
          <h4 className="footer-head">Categories</h4>
          <ul>
            {categories.slice(0,8).map(c=> (
              <li key={c}><Link href={`/retail?category=${c}`}>{c}</Link></li>
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
            <li><a href={`https://wa.me/${WHATSAPP_PHONE}?text=Hi%20I%20want%20to%20discuss%20sourcing`} target="_blank" rel="noreferrer">WhatsApp: {WHATSAPP_PHONE}</a></li>
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
