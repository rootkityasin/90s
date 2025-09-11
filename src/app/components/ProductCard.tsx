"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '../../lib/types';
import { WHATSAPP_PHONE, FACEBOOK_PAGE_URL } from '../../lib/config';
import { ZoomImage } from './ZoomImage';

export function ProductCard({ p, showPrice, token }: { p: Product; showPrice: boolean; token?: string }) {
  const firstVariant = p.variants[0];
  const href = `/product/${p.slug}${showPrice ? '' : '?mode=client'}`;
  return (
    <Link href={href} style={{ textDecoration:'none' }}>
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 18, scale:.95 }}
      whileInView={{ opacity: 1, y: 0, scale:1 }}
      whileHover={{ y:-6, rotate:0.2, scale:1.02 }}
      whileTap={{ scale:.97 }}
      viewport={{ once: true, margin:'-40px' }}
      transition={{ duration:.55, ease:[0.22,0.68,0,1] }}
      role="group"
    >
      <div className="badge">{p.category}</div>
      {/* Using next/image would need explicit height/width; for simplicity using plain img now */}
  <ZoomImage src={p.heroImage} alt={p.title} height={160} />
      <h3>{p.title}</h3>
      <p style={{ fontSize:'.75rem', lineHeight:1.3 }}>{p.description}</p>
      {showPrice ? (
        <p style={{ fontWeight:600, marginTop:'.5rem', color:'var(--color-accent-2)' }}>৳ {firstVariant.retailPriceBDT}</p>
      ) : token ? (
        <p style={{ fontSize:'.7rem', marginTop:'.6rem' }}>Token (SKU): <strong>{token}</strong></p>
      ) : null}
      {!showPrice && token && (
        <div style={{ display:'flex', gap:'.6rem', marginTop:'.9rem', flexWrap:'wrap' }} onClick={e=>e.stopPropagation()}>
          <a className="pill" style={{ background:'var(--color-accent)', textDecoration:'none' }} href={`https://wa.me/${WHATSAPP_PHONE}?text=Sample%20Token:%20${encodeURIComponent(token)}`} target="_blank" rel="noreferrer">WA</a>
          <a className="pill" style={{ background:'#111', textDecoration:'none' }} href={`${FACEBOOK_PAGE_URL.replace(/\/$/, '')}?ref=${encodeURIComponent(token)}`} target="_blank" rel="noreferrer">FB</a>
        </div>
      )}
    </motion.div>
    </Link>
  );
}
