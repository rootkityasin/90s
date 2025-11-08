"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatCategoryLabel } from '../../lib/formatCategoryLabel';

type CategoryDropdownProps = {
  target?: 'retail' | 'client';
};

export function CategoryDropdown({ target }: CategoryDropdownProps = {}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  // Derive categories from product data to keep in sync with product list
  const [cats, setCats] = React.useState<string[]>([]);
  const [subMap, setSubMap] = React.useState<Record<string, string[]>>({});
  const resolvedTarget = React.useMemo(() => {
    if (target) return target;
    return pathname.startsWith('/client') ? 'client' : 'retail';
  }, [target, pathname]);

  React.useEffect(() => {
    let cancelled = false;
    async function fetchCategories() {
      try {
        const endpoint = resolvedTarget === 'client' ? '/api/client/products' : '/api/retail/products';
        const res = await fetch(endpoint, { cache: 'no-store' });
        const data = await res.json();
        if (!data?.success) return;
        const list: any[] = Array.isArray(data.products) ? data.products : [];

        const deriveTree = (products: any[]): Record<string, string[]> => {
          const tree: Record<string, string[]> = {};
          products.forEach((p) => {
            if (!p?.category) return;
            if (!tree[p.category]) tree[p.category] = [];
            if (p.subCategory && !tree[p.category].includes(p.subCategory)) {
              tree[p.category].push(p.subCategory);
            }
          });
          Object.keys(tree).forEach((key) => {
            tree[key] = tree[key].slice().sort((a, b) => a.localeCompare(b));
          });
          return tree;
        };

        const categories: string[] = Array.isArray(data.categories) && data.categories.length
          ? (data.categories as string[]).slice().sort((a, b) => a.localeCompare(b))
          : Array.from(new Set(list.map((p: any) => p?.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));

        const treeRaw: Record<string, string[]> = data.categoryTree && typeof data.categoryTree === 'object'
          ? Object.fromEntries(Object.entries(data.categoryTree).map(([key, value]) => [key, Array.isArray(value) ? (value as string[]).slice().sort((a, b) => a.localeCompare(b)) : []]))
          : deriveTree(list);

        const tree: Record<string, string[]> = { ...treeRaw };
        categories.forEach((cat) => {
          if (!tree[cat]) tree[cat] = [];
        });

        if (!cancelled) {
          setCats(categories);
          setSubMap(tree);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch categories:', error);
        }
      }
    }
    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, [resolvedTarget]);

  const baseHref = resolvedTarget === 'client' ? '/client/catalog' : '/retail';

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Close on outside click or Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside, { capture: true });
    document.addEventListener('touchstart', handleOutside, { capture: true });
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside, { capture: true } as any);
      document.removeEventListener('touchstart', handleOutside, { capture: true } as any);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // Close on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="category-dropdown" ref={rootRef}>
      <button 
        className="category-toggle"
        onClick={toggleDropdown}
        aria-label="Browse categories"
        aria-expanded={isOpen}
      >
        Categories
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="category-menu">
          <ul>
            <li>
              <Link href={baseHref} onClick={closeDropdown} className="category-link">All Products</Link>
            </li>
            {cats.map((key) => (
              <li key={key}>
                <Link 
                  href={`${baseHref}?category=${encodeURIComponent(key)}`}
                  onClick={closeDropdown}
                  className="category-link"
                >
                  {formatCategoryLabel(key)}
                </Link>
                {subMap[key]?.length ? (
                  <ul className="category-sublist">
                    {subMap[key].map((sub) => (
                      <li key={sub}>
                        <Link
                          href={`${baseHref}?category=${encodeURIComponent(key)}&subCategory=${encodeURIComponent(sub)}`}
                          onClick={closeDropdown}
                          className="category-sublink"
                        >
                          {formatCategoryLabel(undefined, sub)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}