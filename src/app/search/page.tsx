import React from 'react';
import { listProducts } from '../../lib/data/store';
import { ProductCard } from '../components/ProductCard';

export const metadata = { title: 'Search | 90\'s Legacy' };

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').toLowerCase();
  const all = listProducts();
  const results = q ? all.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) : [];
  return (
    <div className="container" style={{ marginTop:'1.4rem', marginBottom:'3.4rem' }}>
      <div className="panel textured" style={{ padding:'1.8rem 2rem 2.2rem' }}>
        <h1 className="header-accent" style={{ fontSize:'2.1rem', margin:'0 0 1rem' }}>Search</h1>
        <p style={{ fontSize:'.8rem', margin:'0 0 1.4rem' }}>Query: <strong>{q || '—'}</strong></p>
        {q && results.length === 0 && <p style={{ fontSize:'.8rem' }}>No products found.</p>}
        <div className="grid" style={{ marginTop:'1rem' }}>
          {results.map(p => (
            <ProductCard key={p.id} p={p} showPrice={true} />
          ))}
        </div>
        {!q && <p style={{ fontSize:'.75rem', opacity:.7 }}>Type a term in the top search bar.</p>}
      </div>
    </div>
  );
}