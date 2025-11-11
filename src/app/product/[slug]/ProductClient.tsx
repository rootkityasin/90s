"use client";
import React from 'react';
import { Product } from '../../../lib/types';
import { ZoomImage } from '../../components/ZoomImage';
import { useCart } from '../../components/cart/CartContext';
import { formatCategoryLabel } from '../../../lib/formatCategoryLabel';

const FALLBACK_FABRIC_DETAILS = 'Fabric: Premium cotton blend with natural stretch for breathable comfort. Pre-laundered for a soft, broken-in hand feel. Colorfast finishing preserves the tone wear after wear.';
const FALLBACK_CARE_INSTRUCTIONS = 'Care: Machine wash cold inside out with like colours. Do not bleach. Tumble dry low or line dry. Warm iron on reverse if needed.';

type OrderDetails = {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  notes: string;
};

const EMPTY_ORDER_DETAILS: OrderDetails = {
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  notes: ''
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function ProductClient({ product, isClient }: { product: Product; isClient: boolean }) {
  const p = product;
  const { add } = useCart();
  const [activeImg, setActiveImg] = React.useState(p.images?.[0] || p.heroImage);
  const [variantIndex, setVariantIndex] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [generatedToken, setGeneratedToken] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [showOrderForm, setShowOrderForm] = React.useState(false);
  const [orderDetails, setOrderDetails] = React.useState<OrderDetails>({ ...EMPTY_ORDER_DETAILS });
  const [formError, setFormError] = React.useState<string | null>(null);
  const [orderSubmitted, setOrderSubmitted] = React.useState(false);
  const [submittedOrder, setSubmittedOrder] = React.useState<OrderDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [modalMounted, setModalMounted] = React.useState(false);

  const variant = p.variants[variantIndex];
  
  function inc(delta: number) { setQty(q => Math.max(1, q + delta)); }
  function handleAdd() { add(p, variant, qty); }

  function openOrderForm() {
    if (!modalMounted) setModalMounted(true);
    setShowOrderForm(true);
    setGeneratedToken(null);
    setOrderSubmitted(false);
    setFormError(null);
    setSubmittedOrder(null);
    setCopied(false);
    setIsSubmitting(false);
  }

  function closeOrderForm() {
    setShowOrderForm(false);
    setFormError(null);
  }

  function handleOrderInputChange(field: keyof OrderDetails, value: string) {
    setOrderDetails(prev => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  }

  async function handleOrderSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const trimmed: OrderDetails = {
      name: orderDetails.name.trim(),
      email: orderDetails.email.trim(),
      phone: orderDetails.phone.trim(),
      company: orderDetails.company.trim(),
      address: orderDetails.address.trim(),
      notes: orderDetails.notes.trim()
    };

    const errors: string[] = [];
    if (!trimmed.name) errors.push('Name is required.');
    if (!trimmed.email || !EMAIL_REGEX.test(trimmed.email)) errors.push('Valid email is required.');
    if (!trimmed.phone) errors.push('Phone number is required.');
    if (!trimmed.address) errors.push('Address is required.');

    if (errors.length) {
      setFormError(errors.join(' '));
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/client/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: variant.sku,
          quantity: qty,
          color: variant.color,
          size: variant.size,
          productId: p.id,
          productCode,
          variantId: variant.id,
          productSnapshot: {
            productTitle: p.title,
            heroImage: p.heroImage,
            productSlug: p.slug,
            productCode
          },
          client: {
            name: trimmed.name,
            email: trimmed.email,
            phone: trimmed.phone,
            company: trimmed.company || undefined,
            address: trimmed.address,
            notes: trimmed.notes || undefined
          }
        })
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to generate token.');
      }

      const tokenString: string | undefined = data?.token || data?.record?.token;
      if (!tokenString) {
        throw new Error('Token not returned by server.');
      }

      const serverClient = data?.record?.client;
      const confirmedClient: OrderDetails = serverClient ? {
        name: serverClient.name,
        email: serverClient.email,
        phone: serverClient.phone,
        company: serverClient.company ?? '',
        address: serverClient.address,
        notes: serverClient.notes ?? ''
      } : trimmed;

      setGeneratedToken(tokenString);
      setCopied(false);
      setFormError(null);
      setOrderSubmitted(true);
      setSubmittedOrder(confirmedClient);
      setOrderDetails({ ...EMPTY_ORDER_DETAILS });
      setShowOrderForm(false);

      console.info('Client token stored', {
        token: tokenString,
        productCode,
        variantSKU: variant.sku,
        quantity: qty,
        clientDetails: confirmedClient
      });
    } catch (err: any) {
      setFormError(err?.message || 'Failed to generate token. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetTokenFlow() {
    setGeneratedToken(null);
    setOrderSubmitted(false);
    setSubmittedOrder(null);
    setShowOrderForm(true);
    setCopied(false);
    setOrderDetails({ ...EMPTY_ORDER_DETAILS });
    setFormError(null);
    setIsSubmitting(false);
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
          loading="eager"
          decoding="sync"
        />
        {p.images && p.images.length > 1 && (
          <div style={{ display:'flex', gap:'.4rem', marginTop:'.6rem', flexWrap:'wrap' }}>
            {p.images.slice(0,8).map(img => (
              <button key={img} onClick={()=>setActiveImg(img)} style={{ padding:0, border:'2px solid '+(img===activeImg?'var(--color-accent)':'#222'), background:'transparent', borderRadius:10, cursor:'pointer' }}>
                <img src={img} alt='' loading="lazy" decoding="async" style={{ width:54, height:54, objectFit:'cover', display:'block', borderRadius:8 }} />
              </button>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex:1, minWidth:300 }}>
  <h1 className='header-accent jackport-font' style={{ marginTop:0 }}>{p.title}</h1>
  <p style={{ fontSize:'.62rem', letterSpacing:'.8px', margin:'0 0 .8rem', color:'var(--color-accent)' }}>{categoryLabel}</p>
    <p style={{ fontSize:'.65rem', letterSpacing:'.1em', textTransform:'uppercase', margin:'-.4rem 0 1rem', opacity:.7 }}>Product Code: {productCode}</p>
        {p.description?.trim() && (
          <p style={{ fontSize:'.8rem', lineHeight:1.45, fontFamily:'var(--font-body)', letterSpacing:'.01em' }}>{p.description}</p>
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
          <div style={{ marginTop: '1.5rem', maxWidth: 520 }}>
            <button onClick={openOrderForm} style={{ marginBottom: '1rem' }}>Provide Details &amp; Generate Token</button>

            {orderSubmitted && generatedToken && (
              <div style={successCardStyle}>
                <div style={{ fontSize: '.8rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '.75rem' }}>
                  Token ready — share with the 90s team.
                </div>
                {submittedOrder && (
                  <dl style={detailsGridStyle}>
                    <dt>Name</dt><dd>{submittedOrder.name}</dd>
                    <dt>Email</dt><dd>{submittedOrder.email}</dd>
                    {submittedOrder.phone && (<><dt>Phone</dt><dd>{submittedOrder.phone}</dd></>)}
                    {submittedOrder.company && (<><dt>Company</dt><dd>{submittedOrder.company}</dd></>)}
                    <dt>Address</dt><dd>{submittedOrder.address}</dd>
                    {submittedOrder.notes && (<><dt>Notes</dt><dd>{submittedOrder.notes}</dd></>)}
                  </dl>
                )}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                  <input type="text" readOnly value={generatedToken} style={tokenInputStyle} />
                  <button onClick={handleCopy} title={copied ? 'Copied!' : 'Copy Token'} style={{ position: 'absolute', right: 1, top: 1, bottom: 1, background: 'transparent', border: 'none', padding: '0 0.75rem', cursor: 'pointer', color: copied ? 'var(--color-accent)' : '#fff' }}>
                    {copied ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.286.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                    )}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.75rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>
                  <span>Variant: {variant.size} · Qty: {qty}</span>
                  <button type="button" className="secondary" onClick={resetTokenFlow} style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                    Generate another token
                  </button>
                </div>
              </div>
            )}

            {modalMounted && (
              <div
                style={showOrderForm ? modalOverlayStyle : modalOverlayHiddenStyle}
                onClick={showOrderForm ? closeOrderForm : undefined}
                aria-hidden={!showOrderForm}
              >
                <div
                  style={showOrderForm ? modalCardStyle : modalCardHiddenStyle}
                  className="client-token-modal"
                  onClick={e => e.stopPropagation()}
                >
                    <button
                      type="button"
                      onClick={closeOrderForm}
                      style={modalCloseButtonStyle}
                      aria-label="Close order details form"
                    >
                      ×
                    </button>
                    <h2 style={{ margin: '0 0 .8rem', fontSize: '1.25rem', letterSpacing: '.6px' }}>Share details to lock your token</h2>
                    <p style={{ margin: '0 0 1rem', fontSize: '.72rem', lineHeight: 1.48, color: 'rgba(248,245,235,0.9)' }}>
                      Provide the essentials so our sourcing team can reference this SKU token and follow up quickly with samples, pricing, or contracts.
                    </p>
                    {formError && <p style={{ ...errorTextStyle, color: '#ffb4a2', marginBottom: '.6rem' }}>{formError}</p>}
                    <form onSubmit={handleOrderSubmit} style={formLayoutStyle}>
                    <div style={formGroupStyle}>
                      <label style={modalLabelStyle}>Full Name<span style={{ color: '#fdd6ba', marginLeft: 4 }}>*</span></label>
                      <input
                        type="text"
                        value={orderDetails.name}
                        onChange={e => handleOrderInputChange('name', e.target.value)}
                        style={modalInputStyle}
                        placeholder="e.g. Alex Rahman"
                        required
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={modalLabelStyle}>Email<span style={{ color: '#fdd6ba', marginLeft: 4 }}>*</span></label>
                      <input
                        type="email"
                        value={orderDetails.email}
                        onChange={e => handleOrderInputChange('email', e.target.value)}
                        style={modalInputStyle}
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                    <div style={twoColumnGroupStyle}>
                      <div style={{ ...formGroupStyle, marginBottom: 0, maxWidth: 220 }}>
                        <label style={modalLabelStyle}>Phone<span style={{ color: '#fdd6ba', marginLeft: 4 }}>*</span></label>
                        <input
                          type="tel"
                          value={orderDetails.phone}
                          onChange={e => handleOrderInputChange('phone', e.target.value)}
                          style={modalInputStyle}
                          placeholder="e.g. +8801XXXXXXX"
                          required
                        />
                      </div>
                      <div style={{ ...formGroupStyle, marginBottom: 0, maxWidth: 220 }}>
                        <label style={modalLabelStyle}>Company</label>
                        <input
                          type="text"
                          value={orderDetails.company}
                          onChange={e => handleOrderInputChange('company', e.target.value)}
                          style={modalInputStyle}
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                    <div style={formGroupStyle}>
                      <label style={modalLabelStyle}>Address<span style={{ color: '#fdd6ba', marginLeft: 4 }}>*</span></label>
                      <textarea
                        value={orderDetails.address}
                        onChange={e => handleOrderInputChange('address', e.target.value)}
                        style={{ ...modalInputStyle, minHeight: 90, resize: 'vertical' }}
                        placeholder="Delivery or sample drop address"
                        required
                      />
                    </div>
                    <div style={formGroupStyle}>
                      <label style={modalLabelStyle}>Notes</label>
                      <textarea
                        value={orderDetails.notes}
                        onChange={e => handleOrderInputChange('notes', e.target.value)}
                        style={{ ...modalInputStyle, minHeight: 70, resize: 'vertical' }}
                        placeholder="Fabric preference, timeline, extra context (optional)"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1.1rem' }}>
                      <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Generating…' : 'Submit & Generate Token'}
                      </button>
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => setOrderDetails({ ...EMPTY_ORDER_DETAILS })}
                        style={{ border: '1px solid rgba(17,24,39,0.22)', color: 'rgba(17,24,39,0.72)' }}
                      >
                        Clear Form
                      </button>
                    </div>
                  </form>
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
const formGroupStyle: React.CSSProperties = { display:'flex', flexDirection:'column', gap:'.35rem', marginBottom:'.8rem' };
const errorTextStyle: React.CSSProperties = { fontSize:'.65rem', margin:'0 0 .6rem' };
const successCardStyle: React.CSSProperties = { marginTop:'1.2rem', padding:'1.25rem 1.4rem', borderRadius:16, background:'rgba(15,22,40,0.98)', border:'1px solid rgba(122,2,2,0.35)', color:'#f7f7f7', boxShadow:'0 24px 42px -26px rgba(0,0,0,.7)' };
const detailsGridStyle: React.CSSProperties = { margin:0, display:'grid', gridTemplateColumns:'auto 1fr', columnGap:'.75rem', rowGap:'.35rem', fontSize:'.68rem', letterSpacing:'.05em' };
const tokenInputStyle: React.CSSProperties = { ...selectStyle, flex:1, padding:'0.8rem', paddingRight:'2.5rem', background:'#111' };
const modalOverlayStyle: React.CSSProperties = {
  position:'fixed',
  inset:0,
  background:'rgba(0,0,0,.55)',
  backdropFilter:'blur(4px)',
  display:'flex',
  alignItems:'flex-start',
  justifyContent:'center',
  overflowY:'auto',
  padding:'4rem 1rem',
  zIndex:240,
  opacity: 1,
  visibility: 'visible',
  transition: 'opacity .24s ease, visibility .24s ease'
};

const modalOverlayHiddenStyle: React.CSSProperties = {
  ...modalOverlayStyle,
  opacity: 0,
  visibility: 'hidden',
  pointerEvents: 'none'
};

const modalCardStyle: React.CSSProperties = {
  padding: '2.2rem 2.4rem 2rem',
  borderRadius: 26,
  width: 'min(92vw, 520px)',
  position: 'relative',
  boxShadow: '0 40px 80px -45px rgba(0,0,0,.85)',
  border: '1px solid rgba(120,86,52,0.18)',
  overflow: 'hidden',
  transform: 'translateY(0) scale(1)',
  opacity: 1,
  transition: 'transform .24s cubic-bezier(.22,.68,0,1), opacity .24s ease'
};

const modalCardHiddenStyle: React.CSSProperties = {
  ...modalCardStyle,
  transform: 'translateY(16px) scale(.96)',
  opacity: 0
};
const modalCloseButtonStyle: React.CSSProperties = { position:'absolute', top:12, right:14, background:'#214c50', color:'#f4f1e8', border:'none', borderRadius:'50%', width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 18px 34px -18px rgba(12,35,40,0.55)', fontSize:'1.25rem', fontWeight:600, lineHeight:1 };
const formLayoutStyle: React.CSSProperties = { display:'flex', flexDirection:'column', gap:'.65rem' };
const twoColumnGroupStyle: React.CSSProperties = { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1.2rem', alignItems:'start', marginBottom:'.75rem' };
const modalLabelStyle: React.CSSProperties = { fontSize:'.62rem', textTransform:'uppercase', letterSpacing:'.85px', color:'rgba(248,245,235,0.88)' };
const modalInputStyle: React.CSSProperties = { width:'100%', padding:'.75rem .85rem', borderRadius:12, border:'1px solid rgba(19,34,36,0.28)', background:'rgba(248,245,235,0.94)', fontSize:'.78rem', letterSpacing:'.3px', color:'#0f1d1e', boxShadow:'inset 0 1px 3px rgba(17,24,39,0.12)' };
