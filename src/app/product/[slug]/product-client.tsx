"use client";
import React from 'react';
import { Product } from '../../../lib/types';
import { ZoomImage } from '../../components/ZoomImage';
import { useCart } from '../../components/cart/CartContext';
import { generateWholesaleToken } from '../../../lib/data/store';

export default function ProductDetailClient({ product, isWholesale }: { product: Product; isWholesale: boolean }) {
  const p = product;
  const { add } = useCart();
  const [activeImg, setActiveImg] = React.useState(p.images?.[0] || p.heroImage);
  const [variantIndex, setVariantIndex] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const variant = p.variants[variantIndex];
  const token = isWholesale ? generateWholesaleToken(variant.sku) : null;

  function inc(delta: number) { setQty(q => Math.max(1, q + delta)); }
  function handleAdd() { add(p, variant, qty); }

  return (
    <div style={{ display:'flex', gap:'2.2rem', flexWrap:'wrap' }}>
      <div style={{ width:380, maxWidth:'100%' }}>
        <ZoomImage src={activeImg} alt={p.title} height={420} radius={20} zoomScale={2.4} style={{ boxShadow:'0 6px 18px -8px rgba(0,0,0,.4)' }} />
        {p.images && p.images.length > 1 && (
          <div style={{ display:'flex', gap:'.4rem', marginTop:'.6rem', flexWrap:'wrap' }}>
            {p.images.slice(0,8).map(img => (
              <button key={img} onClick={()=>setActiveImg(img)} style={{ padding:0, border:'2px solid '+(img===activeImg?'var(--color-accent)':'#222'), background:'transparent', borderRadius:10, cursor:'pointer' }}>
                <img src={img} alt='' style={{ width:54, height:54, objectFit:'cover', display:'block', borderRadius:8 }} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex:1, minWidth:300 }}>
        <h1 className='header-accent' style={{ marginTop:0 }}>{p.title}</h1>
        <p style={{ fontSize:'.8rem', lineHeight:1.45 }}>{p.description}</p>
        <div style={{ background:'var(--color-surface)', padding:'1rem 1.1rem', borderRadius:16, margin:'1rem 0', fontSize:'.65rem', letterSpacing:'.5px', lineHeight:1.4 }}>
          <strong style={{ fontSize:'.7rem' }}>FABRIC & DETAILS</strong><br />
          95% Cotton / 5% Elastane (example) • Pre-washed • Colorfast • Soft hand-feel.<br />
          Care: Cold wash, inside out, no bleach, tumble dry low.
        </div>
        {isWholesale ? (
          <div style={{ fontSize:'.7rem', background:'var(--color-surface)', padding:'.7rem 1rem', borderRadius:14, display:'inline-block' }}>
            Token (SKU): <strong>{token}</strong>
          </div>
        ) : (
          <p style={{ fontWeight:700, fontSize:'1rem', color:'var(--color-accent-2)', margin:'0 0 .8rem' }}>৳ {variant.retailPriceBDT}</p>
        )}
        <div style={{ display:'flex', gap:'.8rem', flexWrap:'wrap', marginBottom:'1rem' }}>
          <label style={labelStyle}>Size
            <select value={variantIndex} onChange={e=>setVariantIndex(parseInt(e.target.value))} style={selectStyle}>
              {p.variants.map((v,i)=>(<option key={v.id} value={i}>{v.size}</option>))}
            </select>
          </label>
          <label style={labelStyle}>Color
            <input value={variant.color} readOnly style={{ ...selectStyle, cursor:'default', background:'#1e2b4f55' }} />
          </label>
          <label style={labelStyle}>Qty
            <div style={{ display:'flex', alignItems:'center', gap:'.4rem' }}>
              <button type='button' onClick={()=>inc(-1)} style={qtyBtn}>-</button>
              <input value={qty} readOnly style={{ width:46, textAlign:'center', ...selectStyle }} />
              <button type='button' onClick={()=>inc(1)} style={qtyBtn}>+</button>
            </div>
          </label>
        </div>
        {!isWholesale && (
          <div style={{ display:'flex', gap:'.7rem', flexWrap:'wrap' }}>
            <button onClick={handleAdd}>Add to Cart</button>
            <button className='secondary' style={{ background:'#111' }}>Buy Now</button>
          </div>
        )}
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = { background:'#1e2b4f', color:'#fff', border:'1px solid #22315a', padding:'.55rem .75rem', borderRadius:10, fontSize:'.7rem' };
const qtyBtn: React.CSSProperties = { background:'var(--color-accent)', color:'#fff', border:'none', width:34, height:34, borderRadius:10, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 4px rgba(0,0,0,.25)' };
const labelStyle: React.CSSProperties = { fontSize:'.6rem', textTransform:'uppercase', letterSpacing:'.8px', display:'flex', flexDirection:'column', gap:'.25rem' };
