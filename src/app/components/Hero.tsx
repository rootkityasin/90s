"use client";
import React from 'react';
import { motion } from 'framer-motion';

const container = { hidden:{ opacity:0 }, show:{ opacity:1, transition:{ staggerChildren:0.12, delayChildren:0.1 } } };
const item = { hidden:{ opacity:0, y:30, filter:'blur(6px)' }, show:{ opacity:1, y:0, filter:'blur(0)', transition:{ duration:.7, ease:[0.22,0.68,0,1] } } };

export function Hero() {
  return (
    <motion.div className="panel hero" variants={container} initial="hidden" animate="show">
      <motion.div className="hero-left" variants={item}>
        <div className="photo-wrapper float-slow">
          <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800" alt="Vintage clothing" />
        </div>
        <div className="social-row">
          {socialLinks.map(s => (
            <motion.a key={s.label} className="social-icon" aria-label={s.label} href={s.href} rel="noreferrer" whileHover={{ rotate:s.rotate, scale:1.15 }} whileTap={{ scale:.9 }} variants={item}>{s.icon}</motion.a>
          ))}
        </div>
      </motion.div>
      <div>
        <motion.h1 className="hero-headline" variants={item}>Save Money,<br/>Look Great</motion.h1>
        <motion.div className="hero-hours" variants={item}>Open Daily : 9 a.m to 8 p.m</motion.div>
        <motion.div className="hero-actions" variants={item}>
          <a href="/login" className="btn-sale wiggle">50% OFF</a>
          <a href="/retail" className="pill" style={{ background:'#111' }}>Explore Retail</a>
          <a href="/client" className="pill" style={{ background:'#008F7D' }}>Client Samples</a>
        </motion.div>
        <motion.p style={{ fontSize:'.82rem', maxWidth:480, lineHeight:1.45, marginTop:'1.3rem' }} variants={item}>Browse curated fabric & garment samples. Retail shows live prices; client area uses SKU tokens for quick WhatsApp negotiation and sourcing clarity.</motion.p>
      </div>
    </motion.div>
  );
}

import { WHATSAPP_PHONE, FACEBOOK_PAGE_URL } from '../../lib/config';
const socialLinks = [
  { label:'Twitter', href:'#', rotate:-12, icon:<svg viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 0 0 1.88-2.35 8.3 8.3 0 0 1-2.67 1.02A4.15 4.15 0 0 0 16.1 4c-2.31 0-4.18 1.94-4.18 4.33 0 .34.03.67.1.98-3.47-.18-6.55-1.93-8.6-4.59a4.5 4.5 0 0 0-.57 2.18 4.4 4.4 0 0 0 1.86 3.6 4.07 4.07 0 0 1-1.9-.55v.05c0 2.1 1.43 3.85 3.33 4.25-.35.1-.72.15-1.1.15-.27 0-.53-.03-.78-.08.53 1.76 2.06 3.04 3.87 3.08A8.33 8.33 0 0 1 2 19.54 11.75 11.75 0 0 0 8.29 21.5c7.55 0 11.68-6.5 11.68-12.13 0-.19 0-.38-.01-.56A8.6 8.6 0 0 0 22.46 6Z"/></svg> },
  { label:'WhatsApp', href:`https://wa.me/${WHATSAPP_PHONE}?text=Hi%20I%20want%20to%20discuss%20a%20contract`, rotate:6, icon:<svg viewBox="0 0 24 24"><path d="M17.47 14.37c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.21-.62.06-.29-.15-1.24-.46-2.37-1.47-.88-.78-1.47-1.74-1.64-2.03-.17-.29-.02-.45.13-.6.14-.14.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.06-.15-.64-1.55-.88-2.13-.23-.56-.47-.49-.64-.5-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.82 1.18 3.01.15.19 2.03 3.1 4.98 4.34.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12.05 22c-1.94 0-3.85-.53-5.5-1.53l-3.9 1.25 1.27-3.8A10.07 10.07 0 0 1 2 12.05C2 6.52 6.52 2 12.05 2c2.69 0 5.21 1.05 7.11 2.95a9.97 9.97 0 0 1 2.94 7.1c-.01 5.53-4.53 9.95-10.05 9.95z"/></svg> },
  { label:'Facebook', href: FACEBOOK_PAGE_URL, rotate:-8, icon:<svg viewBox="0 0 24 24"><path d="M13.5 22v-8.21h2.75l.41-3.2H13.5V8.26c0-.93.26-1.56 1.6-1.56h1.71V3.83c-.3-.04-1.34-.13-2.55-.13-2.53 0-4.26 1.54-4.26 4.37v2.44H7v3.2h3.01V22h3.49Z"/></svg> },
  { label:'Instagram', href:'#', rotate:10, icon:<svg viewBox="0 0 24 24"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10Zm-5 2.5A5.5 5.5 0 0 0 6.5 12 5.5 5.5 0 0 0 12 17.5 5.5 5.5 0 0 0 17.5 12 5.5 5.5 0 0 0 12 6.5Zm0 2A3.5 3.5 0 0 1 15.5 12 3.5 3.5 0 0 1 12 15.5 3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm4.75-3.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg> }
];
