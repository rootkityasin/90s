"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { listProducts, generateWholesaleToken } from '../../lib/data/store';
import type { Product } from '../../lib/types';
import { ProductCard } from './ProductCard';
import { FadeUpDiv, Stagger } from './animations';

type ProductsPageProps = {
  title: string;
  description: string;
  mode: 'retail' | 'client'; // retail shows price, client shows token
};

// Simple wrapper component that handles fetching + layout + animations
export function ProductsPage({ title, description, mode }: ProductsPageProps) {
  const [rawProducts, setRawProducts] = React.useState<Product[]>(listProducts());
  // realtime subscription (SSE)
  React.useEffect(() => {
    const ev = new EventSource('/api/realtime-products');
    ev.addEventListener('productUpdate', (e: MessageEvent) => {
      try {
        const updated: Product = JSON.parse(e.data);
        setRawProducts(prev => {
          const idx = prev.findIndex(p => p.id === updated.id);
          if (idx === -1) return prev; // ignore if not present (or push?)
          const copy = prev.slice();
            copy[idx] = updated;
          return copy;
        });
      } catch {}
    });
    ev.addEventListener('snapshot', (e: MessageEvent) => {
      try { const list: Product[] = JSON.parse(e.data); setRawProducts(list); } catch {}
    });
    return () => ev.close();
  }, []);
  const showPrice = mode === 'retail';
  // Retail enhancement: local search, category filter, sort
  const categories = React.useMemo(() => Array.from(new Set(rawProducts.map(p => p.category))).sort(), [rawProducts]);
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState<string>('all');
  const [sort, setSort] = React.useState<'recent' | 'price-asc' | 'price-desc'>('recent');

  // Sync category from URL query (?category=...) so external links like the navbar dropdown filter this page
  const searchParams = useSearchParams();
  React.useEffect(() => {
    if (!searchParams) return;
    const urlCat = searchParams.get('category');
    const normalized = urlCat && categories.includes(urlCat) ? urlCat : 'all';
    setCat(prev => (prev === normalized ? prev : normalized));
    // We intentionally do not sync q/sort from URL right now
  }, [searchParams, categories]);

  const filtered = rawProducts.filter(p => {
    if (cat !== 'all' && p.category !== cat) return false;
    if (q && !p.title.toLowerCase().includes(q.toLowerCase()) && !p.description.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const products = filtered.slice().sort((a,b) => {
    if (sort === 'price-asc') return a.variants[0].retailPriceBDT - b.variants[0].retailPriceBDT;
    if (sort === 'price-desc') return b.variants[0].retailPriceBDT - a.variants[0].retailPriceBDT;
    return 0; // recent (original order from store unmodified)
  });

  return (
    <main className="container">
      <FadeUpDiv index={0}><h1 className='header-accent'>{title}</h1></FadeUpDiv>
      <FadeUpDiv index={1}><p style={{ maxWidth:640, fontSize:'.8rem' }}>{description}</p></FadeUpDiv>
      {showPrice && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'.8rem', marginTop:'1.4rem', alignItems:'center', background:'var(--color-surface)', padding:'1rem 1.2rem', borderRadius:16, boxShadow:'0 4px 14px -6px rgba(0,0,0,.25)' }}>
          <input
            placeholder='Search retail products'
            value={q}
            onChange={e=>setQ(e.target.value)}
            style={controlStyle}
            aria-label='Search products'
          />
          <select value={cat} onChange={e=>setCat(e.target.value)} style={controlStyle} aria-label='Filter category'>
            <option value='all'>All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value as any)} style={controlStyle} aria-label='Sort products'>
            <option value='recent'>Recent</option>
            <option value='price-asc'>Price ↑</option>
            <option value='price-desc'>Price ↓</option>
          </select>
          <span style={{ fontSize:'.65rem', letterSpacing:'.8px', textTransform:'uppercase', opacity:.75 }}>{products.length} items</span>
        </div>
      )}
      <Stagger>
        <div className="grid" style={{ marginTop:'1.2rem' }}>
          {products.map(p => (
            <ProductCard
              key={p.id}
              p={p}
              showPrice={showPrice}
              token={!showPrice ? generateWholesaleToken(p.variants[0].sku) : undefined}
            />
          ))}
        </div>
      </Stagger>
    </main>
  );
}

const controlStyle: React.CSSProperties = {
  background:'#1e2b4f',
  color:'#fff',
  border:'1px solid #22315a',
  padding:'.55rem .75rem',
  borderRadius:10,
  fontSize:'.7rem',
  letterSpacing:'.5px'
};
