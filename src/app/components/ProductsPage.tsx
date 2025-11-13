"use client";
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { generateClientToken } from '../../lib/data/clientUtils';
import type { Product } from '../../lib/types';
import { ProductCard } from './ProductCard';
import { FadeUpDiv, Stagger } from './animations';
import { motion } from 'framer-motion';
import CustomSelect from './CustomSelect';
import { formatCategoryLabel } from '../../lib/formatCategoryLabel';

type ProductsPageProps = {
  title: string;
  description: string;
  mode: 'retail' | 'client'; // retail shows price, client shows token
  productsInitial: Product[]; // Initial products from server
};

// Simple wrapper component that handles fetching + layout + animations
export function ProductsPage({ title, description, mode, productsInitial = [] }: ProductsPageProps) {
  const initialProducts = React.useMemo(
    () => (productsInitial || []).filter((product) => product.base === mode),
    [productsInitial, mode]
  );
  const [rawProducts, setRawProducts] = React.useState<Product[]>(initialProducts);
  React.useEffect(() => {
    setRawProducts(initialProducts);
  }, [initialProducts]);
  // realtime subscription (SSE)
  React.useEffect(() => {
    const ev = new EventSource('/api/realtime-products');
    ev.addEventListener('productUpdate', (e: MessageEvent) => {
      try {
        const updated: Product = JSON.parse(e.data);
        // Only add/update if it matches the current base (retail or client)
        if (updated.base !== mode) return;
        setRawProducts(prev => {
          const filteredPrev = prev.filter(item => item.base === mode);
          const idx = filteredPrev.findIndex(p => p.id === updated.id);
          if (idx === -1) {
            return [updated, ...filteredPrev];
          }
          const copy = filteredPrev.slice();
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
  const categoryEntries = React.useMemo(() => {
    const map = new Map<string, Set<string>>();
    (rawProducts || []).forEach((p) => {
      const category = p.category || 'Uncategorized';
      if (!map.has(category)) map.set(category, new Set());
      if (p.subCategory) {
        map.get(category)!.add(p.subCategory);
      }
    });
    return Array.from(map.entries())
      .map(([cat, subs]) => [cat, Array.from(subs).sort((a, b) => a.localeCompare(b))] as [string, string[]])
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [rawProducts]);
  const categories = React.useMemo(() => categoryEntries.map(([cat]) => cat), [categoryEntries]);
  const categoryTree = React.useMemo(() => {
    const tree: Record<string, string[]> = {};
    categoryEntries.forEach(([cat, subs]) => {
      tree[cat] = subs;
    });
    return tree;
  }, [categoryEntries]);
  const allSubCategories = React.useMemo(() => {
    const set = new Set<string>();
    categoryEntries.forEach(([, subs]) => subs.forEach((sub) => set.add(sub)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [categoryEntries]);
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState<string>('all');
  const [subCat, setSubCat] = React.useState<string>('all');
  const [sort, setSort] = React.useState<'recent' | 'price-asc' | 'price-desc'>('recent');
  const subCategoryOptions = React.useMemo(() => {
    if (cat === 'all') return allSubCategories;
    return categoryTree[cat] || [];
  }, [cat, categoryTree, allSubCategories]);
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
    const urlSub = searchParams.get('subCategory');

    const normalizedCat = urlCat && categories.includes(urlCat) ? urlCat : 'all';
    setCat((prev) => (prev === normalizedCat ? prev : normalizedCat));

    if (urlSub) {
      const isValidSub = normalizedCat === 'all'
        ? allSubCategories.includes(urlSub)
        : (categoryTree[normalizedCat]?.includes(urlSub) ?? false);
      setSubCat(isValidSub ? urlSub : 'all');
    } else {
      setSubCat('all');
    }
    // We intentionally do not sync q/sort from URL right now
  }, [searchParams, categories, categoryTree, allSubCategories]);

  // Reset visible items when filters, search, sort, or underlying data change
  React.useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [q, cat, subCat, sort, (rawProducts || []).length]);

  React.useEffect(() => {
    setSubCat((prev) => {
      if (prev === 'all') return prev;
      if (cat === 'all') {
        return allSubCategories.includes(prev) ? prev : 'all';
      }
      const options = categoryTree[cat] || [];
      return options.includes(prev) ? prev : 'all';
    });
  }, [cat, categoryTree, allSubCategories]);

  const filtered = (rawProducts || []).filter(p => {
    if (p.base !== mode) return false;
    if (cat !== 'all' && p.category !== cat) return false;
    if (subCat !== 'all' && p.subCategory !== subCat) return false;
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
                ...categories.map(c => ({ value: c, label: formatCategoryLabel(c) }))
              ]}
              placeholder="Select category"
              className="filter-cat"
              aria-label="Filter category"
            />
          </div>
          <select value={cat} onChange={e=>setCat(e.target.value)} style={controlStyle} aria-label='Filter category' className="filter-select filter-cat desktop-only">
            <option value='all'>All Categories</option>
            {categories.map(c => <option key={c} value={c}>{formatCategoryLabel(c)}</option>)}
          </select>

          {subCategoryOptions.length > 0 && (
            <>
              <div className="mobile-only" style={{ width:'100%' }}>
                <CustomSelect
                  value={subCat}
                  onChange={(value) => setSubCat(value)}
                  options={[
                    { value: 'all', label: 'All Subcategories' },
                    ...subCategoryOptions.map(sc => ({ value: sc, label: formatCategoryLabel(undefined, sc) }))
                  ]}
                  placeholder="Select subcategory"
                  className="filter-subcat"
                  aria-label="Filter subcategory"
                />
              </div>
              <select value={subCat} onChange={e=>setSubCat(e.target.value)} style={controlStyle} aria-label='Filter subcategory' className="filter-select filter-subcat desktop-only">
                <option value='all'>All Subcategories</option>
                {subCategoryOptions.map(sc => <option key={sc} value={sc}>{formatCategoryLabel(undefined, sc)}</option>)}
              </select>
            </>
          )}
          
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
      {products.slice(0, visible).map(p => {
        const primaryVariant = p.variants[0];
        const clientToken = !showPrice && primaryVariant ? generateClientToken(primaryVariant.sku) : undefined;
        return (
            <ProductCard
              key={p.id}
              p={p}
              showPrice={showPrice}
              token={clientToken}
            />
        );
          })}
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
