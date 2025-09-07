"use client";
import { listProducts, listSales } from '../../lib/data/store';
import { createProduct, editProduct } from './actions';
import { Suspense, useMemo, useState } from 'react';
import AdminAnimatedGrid from './parts/AdminAnimatedGrid';
import FullEditForm from './components/FullEditForm';

export const dynamic = 'force-dynamic';

function TinyLine({ points }: { points: number[] }) {
  const w = 140; const h = 40;
  const max = Math.max(...points);
  const path = points.map((p,i) => `${(i/(points.length-1))*w},${h - (p/max)*h}`).join(' ');
  return <svg width={w} height={h} style={{ overflow:'visible' }}><polyline fill="none" stroke="var(--color-accent)" strokeWidth={2} points={path} /></svg>;
}

export default function Admin() {
  const rawProducts = listProducts();
  const sales = listSales();
  const revenueSeries = sales.map(s => s.revenueBDT);
  const recent = revenueSeries.slice(-8);
  // search/filter/sort (same pattern as retail page)
  const categories = useMemo(() => Array.from(new Set(rawProducts.map(p => p.category))).sort(), [rawProducts]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [sort, setSort] = useState<'recent' | 'price-asc' | 'price-desc'>('recent');
  const filtered = rawProducts.filter(p => {
    if (cat !== 'all' && p.category !== cat) return false;
    if (q && !p.title.toLowerCase().includes(q.toLowerCase()) && !p.description.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const products = filtered.slice().sort((a,b) => {
    if (sort === 'price-asc') return a.variants[0].retailPriceBDT - b.variants[0].retailPriceBDT;
    if (sort === 'price-desc') return b.variants[0].retailPriceBDT - a.variants[0].retailPriceBDT;
    return 0;
  });
  const [editing, setEditing] = useState<any | null>(null);
  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <section style={{ display:'flex', flexWrap:'wrap', gap:'2rem' }}>
        <div>
          <h3 style={{ margin:'0 0 .3rem' }}>Revenue (last {recent.length} days)</h3>
          <TinyLine points={recent} />
        </div>
        <div>
          <h3 style={{ margin:'0 0 .3rem' }}>Products</h3>
          <p style={{ fontSize:'.8rem' }}>{products.length} products live</p>
        </div>
      </section>

      <h2 style={{ marginTop:'2rem' }}>Add Product</h2>
      <form className="product-form" action={createProduct}>
        <label>Title<input name="title" required /></label>
        <label>Slug<input name="slug" placeholder="auto-from-title" /></label>
        <label>Category<input name="category" required /></label>
        <label>Hero Image URL<input name="heroImage" required /></label>
        <label>Description<textarea name="description" rows={3} /></label>
        <label>Price (BDT)<input name="price" type="number" required /></label>
        <label>SKU<input name="sku" required /></label>
        <label>Color<input name="color" required /></label>
        <label>Size<input name="size" required /></label>
        <div style={{ gridColumn:'1 / -1' }}>
          <button type="submit">Create</button>
        </div>
      </form>

      <h2 style={{ marginTop:'2rem' }}>Products</h2>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.8rem', marginTop:'1rem', alignItems:'center', background:'var(--color-surface)', padding:'1rem 1.2rem', borderRadius:16, boxShadow:'0 4px 14px -6px rgba(0,0,0,.25)' }}>
        <input
          placeholder='Search products'
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
      <Suspense>
        <AdminAnimatedGrid products={products} onFullEdit={p=>setEditing(p)} />
      </Suspense>
      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'flex-start', justifyContent:'center', overflowY:'auto', padding:'4rem 1rem', zIndex:200 }} onClick={()=>setEditing(null)}>
          <div style={{ background:'var(--color-surface)', padding:'1.5rem', borderRadius:16, width:'min(100%,960px)', position:'relative' }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setEditing(null)} style={{ position:'absolute', top:8, right:8, background:'#222', color:'#fff', border:'none', borderRadius:6, padding:'.4rem .6rem', fontSize:'.65rem' }}>Close</button>
            <h2 style={{ marginTop:0 }}>Full Edit: {editing.title}</h2>
            <FullEditForm product={editing} />
          </div>
        </div>
      )}
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
