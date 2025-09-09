"use client";
import React, { Suspense, useMemo, useState } from 'react';
import type { Product } from '../../lib/types';
import type { SalesSnapshot } from '../../lib/types';
import AdminAnimatedGrid from './parts/AdminAnimatedGrid';
import AdminDashboardCharts from './components/AdminDashboardCharts';
import FullEditForm from './components/FullEditForm';
import AddProductForm from './components/AddProductForm';
import CustomSelect from '../components/CustomSelect';

type Props = {
  productsInitial: Product[];
  sales: SalesSnapshot[];
};

export default function AdminClient({ productsInitial, sales }: Props) {
  const rawProducts = productsInitial;
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
  const [showAddProduct, setShowAddProduct] = useState(false);
  return (
    <main className="container">
      <h1 className="header-accent" style={{ marginBottom: '.6rem' }}>Admin Dashboard</h1>
      <AdminDashboardCharts sales={sales} products={rawProducts} />

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem' }}>
        <h2 className="header-accent" style={{ margin:0, fontSize:'2rem' }}>Products</h2>
        <button 
          onClick={() => setShowAddProduct(true)}
          style={{ 
            background: 'linear-gradient(135deg, #008F7D 0%, #00A38A 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '.75rem 1.2rem',
            fontSize: '.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,143,125,0.3)',
          }}
        >
          Add Product
        </button>
      </div>
  <div className="filter-bar" style={{ display:'flex', flexWrap:'wrap', gap:'.8rem', marginTop:'1.4rem', marginBottom:'1.2rem', alignItems:'center', background:'var(--color-surface)', padding:'1rem 1.2rem', borderRadius:16, boxShadow:'0 4px 14px -6px rgba(0,0,0,.25)' }}>
        <input
      placeholder='Search retail products'
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={controlStyle}
          aria-label='Search products'
          className="filter-input"
        />
        {/* Category filter - render both, toggle via CSS to match product page */}
        <div className="mobile-only" style={{ width:'100%' }}>
          <CustomSelect
            value={cat}
            onChange={(value) => setCat(value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map(c => ({ value: c, label: c }))
            ]}
            placeholder="Select category"
            className="filter-cat"
            aria-label="Filter category"
          />
        </div>
        <select value={cat} onChange={e=>setCat(e.target.value)} style={controlStyle} aria-label='Filter category' className="filter-select filter-cat desktop-only">
          <option value='all'>All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {/* Sort filter - render both, toggle via CSS to match product page */}
        <div className="mobile-only" style={{ width:'100%' }}>
          <CustomSelect
            value={sort}
            onChange={(value) => setSort(value as any)}
            options={[
              { value: 'recent', label: 'Recent' },
              { value: 'price-asc', label: 'Price ↑' },
              { value: 'price-desc', label: 'Price ↓' }
            ]}
            placeholder="Sort by"
            className="filter-sort"
            aria-label="Sort products"
          />
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value as any)} style={controlStyle} aria-label='Sort products' className="filter-select filter-sort desktop-only">
          <option value='recent'>Recent</option>
          <option value='price-asc'>Price ↑</option>
          <option value='price-desc'>Price ↓</option>
        </select>
        <span className="filter-count" style={{ fontSize:'.65rem', letterSpacing:'.8px', textTransform:'uppercase', opacity:.75 }}>{products.length} items</span>
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

      {showAddProduct && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'flex-start', justifyContent:'center', overflowY:'auto', padding:'4rem 1rem', zIndex:200 }} onClick={()=>setShowAddProduct(false)}>
          <div style={{ background:'var(--color-surface)', padding:'1.5rem', borderRadius:16, width:'min(100%,960px)', position:'relative' }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowAddProduct(false)} style={{ position:'absolute', top:8, right:8, background:'#222', color:'#fff', border:'none', borderRadius:6, padding:'.4rem .6rem', fontSize:'.65rem' }}>Close</button>
            <h2 style={{ marginTop:0 }}>Add New Product</h2>
            <AddProductForm onClose={() => setShowAddProduct(false)} />
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
