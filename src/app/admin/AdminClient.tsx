"use client";
import React, { Suspense, useMemo, useState } from 'react';
import type { Product } from '../../lib/types';
import type { SalesSnapshot } from '../../lib/types';
import AdminAnimatedGrid from './parts/AdminAnimatedGrid';
import AdminDashboardCharts from './components/AdminDashboardCharts';
import FullEditForm from './components/FullEditForm';
import AddProductForm from './components/AddProductForm';
import CustomSelect from '../components/CustomSelect';
import TokenLookupModal from './components/TokenLookupModal';

type Props = {
  productsInitial: Product[];
  sales: SalesSnapshot[];
};

export default function AdminClient({ productsInitial = [], sales = [] }: Props) {
  const rawProducts = productsInitial || [];
  const revenueSeries = sales.map(s => s.revenueBDT);
  const recent = revenueSeries.slice(-8);
  // search/filter/sort (same pattern as retail page)
  const categories = useMemo(() => Array.from(new Set(rawProducts.map(p => p.category))).sort(), [rawProducts]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [sort, setSort] = useState<'recent' | 'price-asc' | 'price-desc'>('recent');
  const filtered = rawProducts.filter(p => {
    if (cat !== 'all' && p.category !== cat) return false;
    if (q) {
      const searchLower = q.toLowerCase();
      const matchesTitle = p.title.toLowerCase().includes(searchLower);
      const matchesDescription = p.description.toLowerCase().includes(searchLower);
      const matchesProductCode = p.productCode?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription && !matchesProductCode) return false;
    }
    return true;
  });
  const products = filtered.slice().sort((a,b) => {
    if (sort === 'price-asc') return a.variants[0].retailPriceBDT - b.variants[0].retailPriceBDT;
    if (sort === 'price-desc') return b.variants[0].retailPriceBDT - a.variants[0].retailPriceBDT;
    return 0;
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showTokenLookup, setShowTokenLookup] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'delete'; message: string } | null>(null);

  // Listen for product update events
  React.useEffect(() => {
    const handleProductUpdated = (e: any) => {
      setNotification({ type: 'success', message: 'Product updated successfully!' });
      setTimeout(() => setNotification(null), 3000);
    };

    const handleProductCreated = (e: any) => {
      setNotification({ type: 'success', message: 'Product created successfully!' });
      setTimeout(() => setNotification(null), 3000);
    };

    const handleProductDeleted = (e: any) => {
      setNotification({ type: 'delete', message: 'Product deleted successfully!' });
      setTimeout(() => setNotification(null), 3000);
    };

    window.addEventListener('productUpdated', handleProductUpdated);
    window.addEventListener('productCreated', handleProductCreated);
    window.addEventListener('productDeleted', handleProductDeleted);

    return () => {
      window.removeEventListener('productUpdated', handleProductUpdated);
      window.removeEventListener('productCreated', handleProductCreated);
      window.removeEventListener('productDeleted', handleProductDeleted);
    };
  }, []);

  return (
    <main className="container">
      <h1 className="header-accent" style={{ marginBottom: '.6rem' }}>Admin Dashboard</h1>
      <AdminDashboardCharts sales={sales} products={rawProducts} />

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem' }}>
        <h2 className="header-accent" style={{ margin:0, fontSize:'2rem' }}>Products</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setShowTokenLookup(true)}
            style={{ 
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              padding: '.75rem 1.2rem',
              fontSize: '.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Token Lookup
          </button>
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
      <Suspense fallback={<p>Loading products...</p>}>
        <AdminAnimatedGrid products={products} onFullEdit={p=>setEditing(p)} />
      </Suspense>
      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'flex-start', justifyContent:'center', overflowY:'auto', padding:'4rem 1rem', zIndex:200 }} onClick={()=>setEditing(null)}>
          <div style={{ background:'var(--color-surface)', padding:'1.5rem', borderRadius:16, width:'min(100%,960px)', position:'relative' }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setEditing(null)} style={{ position:'absolute', top:8, right:8, background:'#222', color:'#fff', border:'none', borderRadius:6, padding:'.4rem .6rem', fontSize:'.65rem' }}>Close</button>
            <h2 style={{ marginTop:0 }}>Full Edit: {editing.title}</h2>
            <FullEditForm product={editing} onClose={() => setEditing(null)} />
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
      {showTokenLookup && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem', zIndex:220 }}
          onClick={()=>setShowTokenLookup(false)}
        >
          <div
            style={{ background:'#f8cfa4', padding:'2.2rem 2.4rem 2rem', borderRadius:26, width:'min(92vw, 520px)', position:'relative', boxShadow:'0 40px 80px -45px rgba(0,0,0,.85)', border:'1px solid rgba(0,0,0,0.08)' }}
            onClick={e=>e.stopPropagation()}
          >
            <button
              onClick={()=>setShowTokenLookup(false)}
              style={{ position:'absolute', top:12, right:14, background:'#c0392b', color:'#fff', border:'none', borderRadius:'50%', width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 18px 34px -18px rgba(192,57,43,0.55)', fontSize:'1.35rem', fontWeight:600, lineHeight:1 }}
              aria-label="Close token lookup"
            >
              ×
            </button>
            <h2 style={{ margin:'0 0 1.2rem', fontSize:'1.35rem', letterSpacing:'0.8px' }}>Token Lookup</h2>
            <TokenLookupModal />
          </div>
        </div>
      )}

      {/* Success/Error Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: notification.type === 'success' 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : notification.type === 'delete'
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: 12,
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '.75rem',
            minWidth: 280,
            animation: 'slideInRight 0.3s ease-out',
          }}
        >
          <div style={{ fontSize: '1.5rem' }}>
            {notification.type === 'success' && '✓'}
            {notification.type === 'delete' && '🗑️'}
            {notification.type === 'error' && '⚠️'}
          </div>
          <div style={{ flex: 1, fontWeight: 600, fontSize: '.85rem', letterSpacing: '.3px' }}>
            {notification.message}
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
