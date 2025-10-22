"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '../../lib/types';
import { WHATSAPP_PHONE, FACEBOOK_PAGE_URL } from '../../lib/config';
import { ZoomImage } from './ZoomImage';

export function ProductCard({ p, showPrice, token }: { p: Product; showPrice: boolean; token?: string }) {
  const firstVariant = p.variants[0];
  const href = showPrice ? `/product/${p.slug}` : `/client/product/${p.slug}`;
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
  <ZoomImage src={p.heroImage} alt={p.title} height={240} noZoom />
    <h3 className="product-title-font">{p.title}</h3>
      <p style={{ fontSize:'.72rem', lineHeight:1.25, marginBottom:'.45rem' }}>{p.description}</p>
      {showPrice ? (
        <p
          style={{
            fontWeight:700,
            margin:0,
            color:'#ff5a0a',
            letterSpacing:'0.02em'
          }}
        >
          ৳ {firstVariant.retailPriceBDT}
        </p>
      ) : token ? (
        <p style={{ fontSize:'.65rem', margin:0 }}>Token: <strong>{token}</strong></p>
      ) : null}
      {/* Removed bottom action buttons to reduce card height */}
    </motion.div>
    </Link>
  );
}
