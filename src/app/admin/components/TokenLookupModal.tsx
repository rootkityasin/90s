"use client";
import React, { useState } from 'react';
import type { Product, Variant, ClientTokenContact, ClientTokenSnapshot } from '../../../lib/types';

interface TokenDetails {
  token: string;
  sku: string;
  product?: Product | null;
  variant?: Variant | null;
  snapshot?: ClientTokenSnapshot;
  quantity: number;
  color: string;
  size: string;
  client?: ClientTokenContact;
  createdAt?: string;
  updatedAt?: string;
}

export default function TokenLookupModal() {
  const [token, setToken] = useState('');
  const [details, setDetails] = useState<TokenDetails | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setDetails(null);
    const trimmed = token.trim();
    if (!trimmed) {
      setError('Please enter a token.');
      return;
    }

    let attemptLegacy = false;
    try {
      const adminResponse = await fetch(`/api/admin/tokens?token=${encodeURIComponent(trimmed)}`);
      if (adminResponse.ok) {
        const payload = await adminResponse.json();
        const detailsFromServer: TokenDetails = {
          token: payload.record.token,
          sku: payload.record.sku,
          product: payload.product ?? null,
          variant: payload.variant ?? null,
          snapshot: payload.record.productSnapshot,
          quantity: payload.record.quantity,
          color: payload.record.color,
          size: payload.record.size,
          client: payload.record.client,
          createdAt: payload.record.createdAt,
          updatedAt: payload.record.updatedAt
        };
        setDetails(detailsFromServer);
        return;
      }

      if (adminResponse.status === 404) {
        attemptLegacy = true;
      } else {
        const payload = await adminResponse.json().catch(() => null);
        setError(payload?.error ?? 'Token lookup failed.');
        return;
      }
    } catch (err) {
      attemptLegacy = true;
    }

    if (!attemptLegacy) {
      return;
    }

    try {
      const legacyParts = trimmed.includes(':') ? trimmed.split(':') : null;
      let sku = trimmed;
      let colorRaw = '';
      let sizeRaw = '';
      let quantity = 1;

      if (legacyParts) {
        if (legacyParts.length < 4) {
          throw new Error('Invalid token format.');
        }
        [sku, colorRaw, sizeRaw] = legacyParts;
        const [quantityRaw] = legacyParts[3].split('#');
        quantity = Number.parseInt(quantityRaw, 10);
        if (!Number.isFinite(quantity) || quantity <= 0) {
          throw new Error('Invalid quantity in token.');
        }
      }

      // Fetch product from API instead of direct import
      const response = await fetch(`/api/client/products?sku=${encodeURIComponent(sku)}`);
      const data = await response.json();
      
      if (!data.success || !data.product) {
        throw new Error('Product not found for the given SKU.');
      }

      const product = data.product;
      const variant = product.variants.find((v: Variant) => v.sku === sku) ?? product.variants[0];
      if (!variant) {
        throw new Error('Variant not found for the given SKU.');
      }

      const resolvedColor = legacyParts ? colorRaw.replace(/-/g, ' ') : variant.color;
      const resolvedSize = legacyParts ? sizeRaw : variant.size;

      setDetails({
        token: trimmed,
        sku,
        product,
        variant,
        quantity,
        color: resolvedColor,
        size: resolvedSize
      });
    } catch (err: any) {
      setError(err?.message ?? 'Failed to parse token.');
    }
  }

  function formatDateTime(value?: string) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  function renderDetails() {
    if (!details) return null;
    const heroImage = details.product?.heroImage ?? details.snapshot?.heroImage ?? null;
    const productTitle = details.product?.title ?? details.snapshot?.productTitle ?? 'Product archived';
    const productCode = details.product?.productCode ?? details.snapshot?.productCode;
    const skuLabel = details.variant?.sku ?? details.sku;
    const description = details.product?.description;
    const createdLabel = formatDateTime(details.createdAt);
    const updatedLabel = formatDateTime(details.updatedAt);

    return (
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          {heroImage ? (
            <img
              src={heroImage}
              alt={productTitle}
              style={thumbStyle}
            />
          ) : (
            <div style={thumbFallbackStyle} aria-hidden="true">NO IMAGE</div>
          )}
          <div>
            <h3 style={productTitleStyle}>{productTitle}</h3>
            <p style={productMetaStyle}>
              SKU {skuLabel}
              {productCode && (
                <>
                  <br />Product Code {productCode}
                </>
              )}
            </p>
            {details.product?.slug && (
              <a
                href={details.product.base === 'client' ? `/client/product/${details.product.slug}` : `/product/${details.product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={productLinkStyle}
              >
                View product page
              </a>
            )}
          </div>
        </div>

        <div style={chipRowStyle}>
          <span style={chipStyle}>Color: {details.color}</span>
          <span style={chipStyle}>Size: {details.size}</span>
          <span style={chipStyle}>Quantity: {details.quantity}</span>
        </div>

        <div style={tokenRowStyle}>
          <span style={tokenLabelStyle}>Token</span>
          <code style={tokenCodeStyle}>{details.token}</code>
        </div>

        {description && <p style={descriptionStyle}>{description}</p>}

        {details.client && (
          <div style={clientCardStyle}>
            <h4 style={clientHeadingStyle}>Client Details</h4>
            <dl style={clientGridStyle}>
              <dt style={clientLabelStyle}>Name</dt><dd>{details.client.name}</dd>
              <dt style={clientLabelStyle}>Email</dt><dd>{details.client.email}</dd>
              <dt style={clientLabelStyle}>Phone</dt><dd>{details.client.phone}</dd>
              {details.client.company && (
                <>
                  <dt style={clientLabelStyle}>Company</dt><dd>{details.client.company}</dd>
                </>
              )}
              <dt style={clientLabelStyle}>Address</dt><dd>{details.client.address}</dd>
              {details.client.notes && (
                <>
                  <dt style={clientLabelStyle}>Notes</dt><dd>{details.client.notes}</dd>
                </>
              )}
            </dl>
          </div>
        )}

        {(createdLabel || updatedLabel) && (
          <div style={timelineRowStyle}>
            {createdLabel && <span>Created: {createdLabel}</span>}
            {updatedLabel && <span>Last lookup: {updatedLabel}</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <form onSubmit={handleSubmit} style={formRowStyle}>
        <input
          value={token}
          onChange={event => setToken(event.target.value)}
          placeholder="Enter generated token"
          style={inputStyle}
          autoFocus
        />
        <button type="submit" style={lookupButtonStyle}>
          Lookup
        </button>
      </form>

      {error && <p style={errorStyle}>{error}</p>}

      {renderDetails()}
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  maxWidth: 480
};

const formRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.65rem'
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.8rem 0.9rem',
  borderRadius: 12,
  border: '1px solid rgba(17, 24, 39, 0.25)',
  background: '#111f3d',
  color: '#fff',
  fontSize: '0.85rem',
  letterSpacing: '0.4px'
};

const lookupButtonStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #008F7D 0%, #00A38A 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 999,
  padding: '0.75rem 1.6rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.85rem',
  boxShadow: '0 14px 28px -18px rgba(0, 143, 125, 0.7)'
};

const errorStyle: React.CSSProperties = {
  color: '#d04545',
  fontSize: '0.78rem',
  letterSpacing: '0.4px'
};

const cardStyle: React.CSSProperties = {
  display: 'grid',
  gap: '0.85rem',
  background: '#f8cfa4',
  borderRadius: 18,
  padding: '1.4rem',
  boxShadow: '0 22px 40px -26px rgba(0,0,0,0.55)'
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center'
};

const thumbStyle: React.CSSProperties = {
  width: 92,
  height: 92,
  objectFit: 'cover',
  borderRadius: 16,
  border: '4px solid rgba(17,24,39,0.12)',
  boxShadow: '0 10px 18px -12px rgba(0,0,0,0.45)'
};

const productTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.05rem',
  letterSpacing: '0.6px'
};

const productMetaStyle: React.CSSProperties = {
  margin: '0.35rem 0 0',
  fontSize: '0.72rem',
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
  color: 'rgba(17,24,39,0.65)'
};

const productLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '0.4rem',
  fontSize: '0.72rem',
  letterSpacing: '0.4px',
  color: '#0b3d91',
  textDecoration: 'underline'
};

const chipRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem'
};

const chipStyle: React.CSSProperties = {
  background: '#111f3d',
  color: '#fff',
  borderRadius: 999,
  padding: '0.35rem 0.75rem',
  fontSize: '0.75rem',
  letterSpacing: '0.5px'
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '0.8rem',
  lineHeight: 1.5,
  color: 'rgba(17,24,39,0.8)'
};

const thumbFallbackStyle: React.CSSProperties = {
  width: 92,
  height: 92,
  borderRadius: 16,
  border: '2px dashed rgba(17,24,39,0.25)',
  display: 'grid',
  placeItems: 'center',
  fontSize: '0.62rem',
  letterSpacing: '0.3em',
  color: 'rgba(17,24,39,0.45)'
};

const tokenRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  background: 'rgba(17,24,39,0.08)',
  borderRadius: 12,
  padding: '0.65rem 0.8rem'
};

const tokenLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  letterSpacing: '.4em',
  textTransform: 'uppercase',
  color: 'rgba(17,24,39,0.55)'
};

const tokenCodeStyle: React.CSSProperties = {
  flex: 1,
  fontSize: '0.82rem',
  fontFamily: 'var(--font-mono, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace)',
  background: '#fff',
  padding: '0.45rem 0.6rem',
  borderRadius: 10,
  border: '1px solid rgba(17,24,39,0.2)',
  color: '#111f3d',
  overflowX: 'auto',
  wordBreak: 'break-all'
};

const clientCardStyle: React.CSSProperties = {
  background: '#fff2dc',
  borderRadius: 14,
  padding: '1rem 1.2rem',
  border: '1px solid rgba(17,24,39,0.1)',
  boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4)'
};

const clientHeadingStyle: React.CSSProperties = {
  margin: '0 0 .6rem',
  fontSize: '0.82rem',
  letterSpacing: '.08em',
  textTransform: 'uppercase'
};

const clientGridStyle: React.CSSProperties = {
  margin: 0,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  columnGap: '.85rem',
  rowGap: '.4rem',
  fontSize: '.78rem',
  letterSpacing: '.05em'
};

const clientLabelStyle: React.CSSProperties = {
  textTransform: 'uppercase',
  letterSpacing: '.35em',
  fontSize: '.62rem',
  color: 'rgba(17,24,39,0.55)'
};

const timelineRowStyle: React.CSSProperties = {
  marginTop: '.2rem',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '.75rem',
  fontSize: '.7rem',
  letterSpacing: '.08em',
  color: 'rgba(17,24,39,0.65)'
};
