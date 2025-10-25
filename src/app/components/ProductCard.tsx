"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '../../lib/types';
import { ZoomImage } from './ZoomImage';

export function ProductCard({ p, showPrice, token }: { p: Product; showPrice: boolean; token?: string }) {
  const firstVariant = p.variants[0];
  const href = showPrice ? `/product/${p.slug}` : `/client/product/${p.slug}`;
  const badgeLabel = p.subCategory ? `${p.category} • ${p.subCategory}` : p.category;
  const blurb = p.description?.trim() || (p.subCategory ? `${p.category} — ${p.subCategory}` : 'View product for full details');
  const productCode = (p.productCode && p.productCode.trim()) || p.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,12);
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
        <div className="badge">{badgeLabel}</div>
        {/* Using next/image would need explicit height/width; for simplicity using plain img now */}
        <ZoomImage src={p.heroImage} alt={p.title} height={240} noZoom />
        <h3
          className="product-title-font"
          style={{
            minHeight: '2.6rem',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {p.title}
        </h3>
        <p style={{ fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', margin: '0 0 .4rem', color: 'rgba(0,0,0,0.6)' }}>Code: {productCode}</p>
        <p
          style={{
            fontSize: '.66rem',
            lineHeight: 1.4,
            marginBottom: '.6rem',
            padding: '.55rem .6rem',
            borderRadius: 10,
            background: 'rgba(17, 17, 17, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            minHeight: '3.2rem',
            marginTop: 0
          }}
        >
          {blurb}
        </p>
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
          <p style={{ fontSize:'.65rem', margin:0 }}>Token: <strong>{token.slice(0, 10)}{token.length > 10 ? '…' : ''}</strong></p>
        ) : null}
      {/* Removed bottom action buttons to reduce card height */}
      </motion.div>
    </Link>
  );
}
