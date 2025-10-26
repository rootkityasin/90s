import React from 'react';
import { listProducts, generateClientToken } from '../../../lib/data/store';
import { ProductCard } from '../../components/ProductCard';
import { enforceClientAccess } from '../../../lib/auth/enforceClientAccess';

export const metadata = { title: "Client Search | 90's Legacy" };

type SearchParams = { q?: string };

export default async function ClientSearchPage({ searchParams }: { searchParams: SearchParams }) {
  const q = (searchParams.q || '').toLowerCase();
  const all = await listProducts();
  enforceClientAccess('/client/search');
  const results = q
    ? all.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="container" style={{ marginTop: '1.4rem', marginBottom: '3.4rem' }}>
      <div className="panel textured" style={{ padding: '1.8rem 2rem 2.2rem' }}>
        <h1 className="header-accent" style={{ fontSize: '2.1rem', margin: '0 0 1rem' }}>Client Search</h1>
        <p style={{ fontSize: '.8rem', margin: '0 0 1.4rem' }}>Query: <strong>{q || '—'}</strong></p>
        {q && results.length === 0 && <p style={{ fontSize: '.8rem' }}>No products found.</p>}
        <div className="grid product-grid" style={{ marginTop: '1rem' }}>
          {results.map(p => (
            <ProductCard
              key={p.id}
              p={p}
              showPrice={false}
              token={generateClientToken(p.variants[0].sku)}
            />
          ))}
        </div>
        {!q && <p style={{ fontSize: '.75rem', opacity: .7 }}>Enter a search term using the top navigation search box.</p>}
      </div>
    </div>
  );
}
