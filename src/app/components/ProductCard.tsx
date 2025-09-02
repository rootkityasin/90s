"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '../../lib/types';

export function ProductCard({ p, showPrice, token }: { p: Product; showPrice: boolean; token?: string }) {
  const firstVariant = p.variants[0];
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 18, scale:.95 }}
      whileInView={{ opacity: 1, y: 0, scale:1 }}
      whileHover={{ y:-6, rotate:0.2, scale:1.02 }}
      whileTap={{ scale:.97 }}
      viewport={{ once: true, margin:'-40px' }}
      transition={{ duration:.55, ease:[0.22,0.68,0,1] }}
    >
      <div className="badge">{p.category}</div>
      {/* Using next/image would need explicit height/width; for simplicity using plain img now */}
  <motion.img src={p.heroImage} alt={p.title} style={{ width:'100%', height:160, objectFit:'cover', borderRadius:8 }} whileHover={{ scale:1.05 }} transition={{ type:'spring', stiffness:220, damping:18 }} />
      <h3>{p.title}</h3>
      <p style={{ fontSize:'.75rem', lineHeight:1.3 }}>{p.description}</p>
      {showPrice ? (
        <p style={{ fontWeight:600, marginTop:'.5rem', color:'var(--color-accent-2)' }}>৳ {firstVariant.retailPriceBDT}</p>
      ) : token ? (
        <p style={{ fontSize:'.7rem', marginTop:'.6rem' }}>Token (SKU): <strong>{token}</strong></p>
      ) : null}
      <div style={{ display:'flex', gap:'.6rem', marginTop:'.9rem', flexWrap:'wrap' }}>
        <Link href={`/product/${p.slug}${showPrice ? '' : '?mode=client'}`} className="pill" style={{ textDecoration:'none' }}>Details</Link>
        {!showPrice && token && (
          <>
            <a className="pill" style={{ background:'var(--color-accent)', textDecoration:'none' }} href={`https://wa.me/${process.env.WHATSAPP_PHONE || '00000000000'}?text=Sample%20Token:%20${token}`} target="_blank">WA</a>
            <a className="pill" style={{ background:'#111', textDecoration:'none' }} href={`https://www.facebook.com/messages/t/YourPage?ref=${token}`} target="_blank">FB</a>
          </>
        )}
      </div>
    </motion.div>
  );
}
