"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '../../lib/types';
import { ZoomImage } from './ZoomImage';
import { useCart } from './cart/CartContext';
import { formatCategoryLabel } from '../../lib/formatCategoryLabel';

export function ProductCard({ p, showPrice, token }: { p: Product; showPrice: boolean; token?: string }) {
  const { add } = useCart();
  const firstVariant = p.variants[0];
  // Use productCode for routing (folder is [slug] but param is treated as productCode)
  const productIdentifier = p.productCode || p.slug;
  const href = showPrice ? `/product/${productIdentifier}` : `/client/product/${productIdentifier}`;
  const formattedCategory = formatCategoryLabel(p.category, p.subCategory);
  const blurb = p.description?.trim() || 'View product for full details';
  const productCode = (p.productCode && p.productCode.trim()) || p.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,12);
  const [frameColor, setFrameColor] = React.useState<string>('#f1e8da');

  React.useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = p.heroImage;

    const handleLoad = () => {
      try {
        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;
        if (!naturalWidth || !naturalHeight) return;

        const sample = Math.max(4, Math.min(32, Math.floor(naturalWidth * 0.1)));
        const canvas = document.createElement('canvas');
        canvas.width = sample;
        canvas.height = sample;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
          img,
          Math.max(0, naturalWidth - sample),
          0,
          sample,
          sample,
          0,
          0,
          sample,
          sample
        );

        const data = ctx.getImageData(0, 0, sample, sample).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }
        if (!count) return;

        const color = `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
        if (!cancelled) setFrameColor(color);
      } catch (err) {
        if (!cancelled) setFrameColor('#f1e8da');
      }
    };

    img.onload = handleLoad;
    img.onerror = () => { if (!cancelled) setFrameColor('#f1e8da'); };

    return () => {
      cancelled = true;
    };
  }, [p.heroImage]);
  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (firstVariant) add(p, firstVariant, 1);
  }
  
  // One-line subtle subtitle under title (no separate description box)
  const subtitle = blurb.replace(/\s+/g,' ').trim();
  const shortSubtitle = subtitle.length > 70 ? subtitle.slice(0, 70) + '…' : subtitle;
  
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        className="card product-card"
        initial={{ opacity: 0, y: 18, scale: .95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -6, rotate: 0.2, scale: 1.02 }}
        whileTap={{ scale: .97 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: .55, ease: [0.22, 0.68, 0, 1] }}
        role="group"
        style={{
          height: '380px',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
  {/* Framed product visual */}
  <div className="pc-image" style={{ position: 'relative', minHeight: 0, margin: 0, background: frameColor, marginBottom: '.5rem' }}>
          <ZoomImage
            src={p.heroImage}
            alt={p.title}
            height={325}
            noZoom
            fit="contain"
            background="transparent"
          />
        </div>

        {/* Title with fixed height - reduced margin */}
        <h3
          className="product-title-font"
          style={{
            height: '2.4rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: '0 0 .15rem',
            flexShrink: 0
          }}
        >
          {p.title}
        </h3>

        {/* Subtle one-liner under title */}
        {subtitle && (
          <p
            style={{
              margin: '0 0 .18rem',
              fontSize: '.64rem',
              color: 'rgba(0,0,0,0.55)'
            }}
          >
            {shortSubtitle}
          </p>
        )}

        {/* Product code - reduced margin */}
        <p
          style={{
            fontSize: '.6rem',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            margin: '0 0 .1rem',
            color: 'rgba(0,0,0,0.6)',
            flexShrink: 0
          }}
        >
          CODE: {productCode}
        </p>

        {/* Price or token information */}
        {showPrice ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginTop: 'auto', paddingTop: '.4rem' }}>
            <div className="card-price" style={{ fontWeight: 800, fontSize: '1.8rem', color: '#7a0202' }}>৳{firstVariant.retailPriceBDT}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
              <div style={{ color: '#7a0202', letterSpacing: '.15rem' }}>★★★★☆</div>
              <div style={{ fontSize: '.6rem', color: 'rgba(0,0,0,.55)' }}>Discount 50%</div>
            </div>
          </div>
        ) : token ? (
          <p style={{ fontSize: '.65rem', margin: '0.25rem 0 0', flexShrink: 0 }}>
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

