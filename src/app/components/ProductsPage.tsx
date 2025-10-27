"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { generateClientToken } from '../../lib/data/clientUtils';
import type { Product } from '../../lib/types';
import { ProductCard } from './ProductCard';
import { FadeUpDiv, Stagger } from './animations';
import { motion } from 'framer-motion';
import CustomSelect from './CustomSelect';

type ProductsPageProps = {
  title: string;
  description: string;
  mode: 'retail' | 'client'; // retail shows price, client shows token
  productsInitial: Product[]; // Initial products from server
};

// Simple wrapper component that handles fetching + layout + animations
export function ProductsPage({ title, description, mode, productsInitial = [] }: ProductsPageProps) {
  const [rawProducts, setRawProducts] = React.useState<Product[]>(productsInitial || []);
  // realtime subscription (SSE)
  React.useEffect(() => {
    const ev = new EventSource('/api/realtime-products');
    ev.addEventListener('productUpdate', (e: MessageEvent) => {
      try {
        const updated: Product = JSON.parse(e.data);
        // Only add/update if it matches the current base (retail or client)
        if (updated.base !== mode) return;
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
      try { 
        const list: Product[] = JSON.parse(e.data);
        // Filter by base (retail or client) before setting
        if (Array.isArray(list)) {
          setRawProducts(list.filter(p => p.base === mode));
        }
      } catch {}
    });
    return () => ev.close();
  }, [mode]);
  const showPrice = mode === 'retail';
  // Retail enhancement: local search, category filter, sort
  const categories = React.useMemo(() => Array.from(new Set((rawProducts || []).map(p => p.category))).sort(), [rawProducts]);
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState<string>('all');
  const [sort, setSort] = React.useState<'recent' | 'price-asc' | 'price-desc'>('recent');
  const PAGE_SIZE = 15;
  const [visible, setVisible] = React.useState(PAGE_SIZE);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = React.useRef(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Sync category from URL query (?category=...) so external links like the navbar dropdown filter this page
  const searchParams = useSearchParams();
  React.useEffect(() => {
    if (!searchParams) return;
    const urlCat = searchParams.get('category');
    const normalized = urlCat && categories.includes(urlCat) ? urlCat : 'all';
    setCat(prev => (prev === normalized ? prev : normalized));
    // We intentionally do not sync q/sort from URL right now
  }, [searchParams, categories]);

  // Reset visible items when filters, search, sort, or underlying data change
  React.useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q, cat, sort, (rawProducts || []).length]);

  const filtered = (rawProducts || []).filter(p => {
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
    return 0; // recent (original order from store unmodified)
  });

  // IntersectionObserver to auto-load more as user nears bottom
  React.useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !loadingMoreRef.current) {
        if (visible < products.length) {
          loadingMoreRef.current = true;
          // Small rAF to batch state updates and avoid rapid double-fires
          requestAnimationFrame(() => {
            setVisible(v => Math.min(v + PAGE_SIZE, products.length));
            loadingMoreRef.current = false;
          });
        }
      }
    }, { root: null, rootMargin: '200px', threshold: 0 });
    io.observe(node);
    return () => io.disconnect();
  }, [visible, products.length]);

  // Toggle scroll-to-top visibility based on scroll depth
  React.useEffect(() => {
    const onScroll = () => {
      // show after user scrolls down a bit
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="container">
      <FadeUpDiv index={0}><h1 className='header-accent'>{title}</h1></FadeUpDiv>
  <FadeUpDiv index={1}><p style={{ maxWidth:640, fontSize:'.8rem', fontFamily:'var(--font-body)' }}>{description}</p></FadeUpDiv>
      {showPrice && (
  <div className="filter-bar" style={{ display:'flex', flexWrap:'wrap', gap:'.8rem', marginTop:'1.4rem', marginBottom:'1.2rem', alignItems:'center', background:'var(--color-surface)', padding:'1rem 1.2rem', borderRadius:16, boxShadow:'0 4px 14px -6px rgba(0,0,0,.25)' }}>
          <input
            placeholder='Search retail products'
            value={q}
            onChange={e=>setQ(e.target.value)}
            style={controlStyle}
            aria-label='Search products'
            className="filter-input"
          />
          {/* Category filter - render both, toggle via CSS to avoid hydration mismatch */}
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
          
          {/* Sort filter - render both, toggle via CSS */}
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
      )}
      <Stagger>
  <div className="grid product-grid" style={{ marginTop:'1.2rem' }}>
      {products.slice(0, visible).map(p => (
            <ProductCard
              key={p.id}
              p={p}
              showPrice={showPrice}
              token={!showPrice ? generateClientToken(p.variants[0].sku) : undefined}
            />
          ))}
        </div>
      </Stagger>
    {/* Sentinel for infinite scroll (hidden, just for IntersectionObserver) */}
    <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

  {visible >= 30 && showScrollTop && (
  <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 18,
            width: 56,
            height: 40,
            borderRadius: 12,
            border: 'none',
            background: 'var(--color-accent)',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 10px 22px -10px rgba(0,0,0,.45)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateX(-50%)'
          }}
        >
          <motion.svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            {/* Double chevron up */}
            <path d="M6 16 L12 10 L18 16" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 20 L12 14 L18 20" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
  </motion.button>
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
