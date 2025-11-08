"use client";
import React from 'react';
import { Product } from '../../../lib/types';
import { ZoomImage } from '../../components/ZoomImage';
import { useCart } from '../../components/cart/CartContext';
import { formatCategoryLabel } from '../../../lib/formatCategoryLabel';

const FALLBACK_FABRIC_DETAILS = 'Fabric: Premium cotton blend with natural stretch for breathable comfort. Pre-laundered for a soft, broken-in hand feel. Colorfast finishing preserves the tone wear after wear.';
const FALLBACK_CARE_INSTRUCTIONS = 'Care: Machine wash cold inside out with like colours. Do not bleach. Tumble dry low or line dry. Warm iron on reverse if needed.';
export default function ProductClient({ product, isClient }: { product: Product; isClient: boolean }) {
  const p = product;
  const { add } = useCart();
  const [activeImg, setActiveImg] = React.useState(p.images?.[0] || p.heroImage);
  const [variantIndex, setVariantIndex] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [generatedToken, setGeneratedToken] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const variant = p.variants[variantIndex];
  
  function inc(delta: number) { setQty(q => Math.max(1, q + delta)); }
  function handleAdd() { add(p, variant, qty); }

  function handleGenerateToken() {
    const tokenString = `${variant.sku}:${variant.color.replace(/\s+/g, '-')}:${variant.size}:${qty}`;
    setGeneratedToken(tokenString);
    setCopied(false);
  }

  function handleCopy() {
    if (!generatedToken) return;
    navigator.clipboard.writeText(generatedToken).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const categoryLabel = formatCategoryLabel(p.category, p.subCategory);
  const productCode = (p.productCode && p.productCode.trim()) || p.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,12);

  return (
    <div style={{ display:'flex', gap:'2.2rem', flexWrap:'wrap' }}>
      <div style={{ width:380, maxWidth:'100%' }}>
        <ZoomImage
          src={activeImg}
          alt={p.title}
          height={420}
          radius={20}
          zoomScale={2.8}
          fit="contain"
          background="#e9dfcf"
          style={{ boxShadow:'0 6px 18px -8px rgba(0,0,0,.4)' }}
        />
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
        <h1 className='header-accent rooster-font' style={{ marginTop:0 }}>{p.title}</h1>
  <p style={{ fontSize:'.62rem', letterSpacing:'.8px', margin:'0 0 .8rem', color:'var(--color-accent)' }}>{categoryLabel}</p>
    <p style={{ fontSize:'.65rem', letterSpacing:'.1em', textTransform:'uppercase', margin:'-.4rem 0 1rem', opacity:.7 }}>Product Code: {productCode}</p>
        {p.description?.trim() && (
          <p style={{ fontSize:'.8rem', lineHeight:1.45 }}>{p.description}</p>
        )}
        <div style={{ background:'var(--color-surface)', padding:'1rem 1.1rem', borderRadius:16, margin:'1rem 0', fontSize:'.65rem', letterSpacing:'.5px', lineHeight:1.4 }}>
          <strong style={{ fontSize:'.7rem' }}>FABRIC & DETAILS</strong><br />
          {(p.fabricDetails?.trim() || FALLBACK_FABRIC_DETAILS)}<br />
          {(p.careInstructions?.trim() || FALLBACK_CARE_INSTRUCTIONS)}
        </div>
        
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

        {isClient ? (
          <div style={{ marginTop: '1.5rem' }}>
            <button onClick={handleGenerateToken} style={{ marginBottom: '1rem' }}>Generate Token</button>
            {generatedToken && (
              <div style={{ maxWidth: 320 }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="text" readOnly value={generatedToken} style={{ ...selectStyle, flex: 1, padding: '0.8rem', paddingRight: '2.5rem', background: '#111' }} />
                  <button onClick={handleCopy} title={copied ? 'Copied!' : 'Copy Token'} style={{ position: 'absolute', right: 1, top: 1, bottom: 1, background: 'transparent', border: 'none', padding: '0 0.75rem', cursor: 'pointer', color: copied ? 'var(--color-accent)' : '#fff' }}>
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.286.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <p style={{ fontWeight:700, fontSize:'1rem', color:'var(--color-accent-2)', margin:'0 0 .8rem' }}>৳ {variant.retailPriceBDT}</p>
            <div style={{ display:'flex', gap:'.7rem', flexWrap:'wrap' }}>
              <button onClick={handleAdd}>Add to Cart</button>
              <button className='secondary' style={{ background:'#111' }}>Buy Now</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = { background:'#1e2b4f', color:'#fff', border:'1px solid #22315a', padding:'.55rem .75rem', borderRadius:10, fontSize:'.7rem' };
const qtyBtn: React.CSSProperties = { background:'var(--color-accent)', color:'#fff', border:'none', width:34, height:34, borderRadius:10, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 4px rgba(0,0,0,.25)' };
const labelStyle: React.CSSProperties = { fontSize:'.6rem', textTransform:'uppercase', letterSpacing:'.8px', display:'flex', flexDirection:'column', gap:'.25rem' };
