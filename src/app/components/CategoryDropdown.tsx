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
  
  // Always use target prop if provided, otherwise derive from pathname
  const resolvedTarget = React.useMemo(() => {
    if (target) return target;
    // Check if we're on client pages
    if (pathname.startsWith('/client')) return 'client';
    // Default to retail for all other pages
    return 'retail';
  }, [target, pathname]);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const mod = await import('../../lib/getCategoriesForBase');
        const { fetchCategoriesForBase } = mod as typeof import('../../lib/getCategoriesForBase');
        const { categories, categoryTree } = await fetchCategoriesForBase(resolvedTarget);
        if (cancelled) return;
        setCats(categories);
        setSubMap(categoryTree);
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch dropdown categories:', error);
        }
      }
    }
    load();
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