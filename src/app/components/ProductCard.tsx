"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '../../lib/types';
import { ZoomImage } from './ZoomImage';
import { useCart } from './cart/CartContext';

export function ProductCard({ p, showPrice, token }: { p: Product; showPrice: boolean; token?: string }) {
  const { add } = useCart();
  const firstVariant = p.variants[0];
  // Use productCode for routing (folder is [slug] but param is treated as productCode)
  const productIdentifier = p.productCode || p.slug;
  const href = showPrice ? `/product/${productIdentifier}` : `/client/product/${productIdentifier}`;
  const badgeLabel = p.subCategory ? `${p.category} • ${p.subCategory}` : p.category;
  const blurb = p.description?.trim() || (p.subCategory ? `${p.category} — ${p.subCategory}` : 'View product for full details');
  const productCode = (p.productCode && p.productCode.trim()) || p.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,12);
  const ribbonText = ((p.subCategory || p.category || '').toUpperCase()).slice(0, 10);
  
  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (firstVariant) add(p, firstVariant, 1);
  }
  
  // One-line subtle subtitle under title (no separate description box)
  const subtitle = blurb.replace(/\s+/g,' ').trim();
  const shortSubtitle = subtitle.length > 70 ? subtitle.slice(0, 70) + '…' : subtitle;
  
  return (
    <Link href={href} style={{ textDecoration:'none', display: 'block' }}>
      <motion.div
        className="card product-card"
        initial={{ opacity: 0, y: 18, scale:.95 }}
        whileInView={{ opacity: 1, y: 0, scale:1 }}
        whileHover={{ y:-6, rotate:0.2, scale:1.02 }}
        whileTap={{ scale:.97 }}
        viewport={{ once: true, margin:'-40px' }}
        transition={{ duration:.55, ease:[0.22,0.68,0,1] }}
        role="group"
        style={{
          height: '450px',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer'
        }}
      >
        {/* Ribbon anchored to card top (overlays image area) */}
        <div className="card-ribbon" aria-label={ribbonText}>
          <span className="ribbon-text">{ribbonText}</span>
        </div>

        {/* Framed product visual */}
        <div className="pc-image" style={{ position:'relative' }}>
          <ZoomImage src={p.heroImage} alt={p.title} height={280} noZoom fit="contain" background="transparent" />
        </div>
        
        {/* Title with fixed height - reduced margin */}
        <h3
          className="product-title-font"
          style={{
            height: '2.8rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: '0.4rem 0 0.15rem',
            flexShrink: 0
          }}
        >
          {p.title}
        </h3>
        
        {/* Subtle one-liner under title */}
        {subtitle && (
          <p style={{
            margin:'0 0 .35rem',
            fontSize: '.72rem',
            color: 'rgba(0,0,0,0.55)'
          }}>{shortSubtitle}</p>
        )}

        {/* Product code - reduced margin */}
        <p style={{ 
          fontSize: '.6rem', 
          letterSpacing: '.12em', 
          textTransform: 'uppercase',
          margin: '0 0 .25rem', 
          color: 'rgba(0,0,0,0.6)',
          flexShrink: 0
        }}>
          CODE: {productCode}
        </p>
        
        {/* Price + stars row */}
        {showPrice ? (
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginTop:'auto' }}>
            <div className="card-price" style={{ fontWeight:800, fontSize:'1.8rem', color:'#7a0202' }}>৳{firstVariant.retailPriceBDT}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.25rem' }}>
              <div style={{ color:'#7a0202', letterSpacing:'.15rem' }}>★★★★☆</div>
              <div style={{ fontSize:'.6rem', color:'rgba(0,0,0,.55)' }}>Discount 50%</div>
            </div>
          </div>
        ) : token ? (
          <p style={{ fontSize:'.65rem', margin:0, marginTop:'auto', flexShrink:0 }}>
            Token: <strong>{token.slice(0, 10)}{token.length > 10 ? '…' : ''}</strong>
          </p>
        ) : null}

        {/* Bottom Add to Cart bar */}
        {showPrice && (
          <button
            className="add-to-cart-bar"
            onClick={handleAdd}
            aria-label="Add to cart"
          >
            ADD TO CART
          </button>
        )}
      </motion.div>
    </Link>
  );
}

