"use client";
import React, { useState } from 'react';
import { getProductBySKU } from '../../../lib/data/store';
import type { Product, Variant } from '../../../lib/types';

interface TokenDetails {
  product: Product;
  variant: Variant;
  quantity: number;
  color: string;
  size: string;
}

export default function TokenLookupModal() {
  const [token, setToken] = useState('');
  const [details, setDetails] = useState<TokenDetails | null>(null);
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setDetails(null);
    const trimmed = token.trim();
    if (!trimmed) {
      setError('Please enter a token.');
      return;
    }

    try {
      const legacyParts = trimmed.includes(':') ? trimmed.split(':') : null;
      let sku = trimmed;
      let colorRaw = '';
      let sizeRaw = '';
      let quantity = 1;

      if (legacyParts) {
        if (legacyParts.length !== 4) {
          throw new Error('Invalid token format.');
        }
        [sku, colorRaw, sizeRaw] = legacyParts;
        const quantityRaw = legacyParts[3];
        quantity = Number.parseInt(quantityRaw, 10);
        if (!Number.isFinite(quantity) || quantity <= 0) {
          throw new Error('Invalid quantity in token.');
        }
      }

      const product = getProductBySKU(sku);
      if (!product) {
        throw new Error('Product not found for the given SKU.');
      }

      const variant = product.variants.find(v => v.sku === sku) ?? product.variants[0];
      if (!variant) {
        throw new Error('Variant not found for the given SKU.');
      }

      const resolvedColor = legacyParts ? colorRaw.replace(/-/g, ' ') : variant.color;
      const resolvedSize = legacyParts ? sizeRaw : variant.size;

      setDetails({
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

      {details && (
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <img
              src={details.product.heroImage}
              alt={details.product.title}
              style={thumbStyle}
            />
            <div>
              <h3 style={productTitleStyle}>{details.product.title}</h3>
              <p style={productMetaStyle}>SKU {details.variant.sku}</p>
            </div>
          </div>

          <div style={chipRowStyle}>
            <span style={chipStyle}>Color: {details.color}</span>
            <span style={chipStyle}>Size: {details.size}</span>
            <span style={chipStyle}>Quantity: {details.quantity}</span>
          </div>

          <p style={descriptionStyle}>{details.product.description}</p>
        </div>
      )}
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
