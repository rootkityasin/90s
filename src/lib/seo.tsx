import React from 'react';

export function JsonLd({ data }: { data: any }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function productJsonLd(p: { name: string; description: string; slug?: string; productCode?: string; image: string; price: number; currency: string; }) {
  const identifier = p.productCode || p.slug || 'unknown';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.image,
    offers: {
      '@type': 'Offer',
      priceCurrency: p.currency,
      price: p.price,
      url: `https://example.com/product/${identifier}`
    }
  };
}
