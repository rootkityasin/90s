"use client";
import React from 'react';
import Link from 'next/link';
import { listProducts } from '../../lib/data/store';

export function CategoryDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  // Derive categories from product data to keep in sync with product list
  const [cats, setCats] = React.useState<string[]>(() => {
    const all = listProducts();
    return Array.from(new Set(all.map(p => p.category))).sort();
  });
  React.useEffect(() => {
    // In case product list updates at runtime via SSE
    const all = listProducts();
    setCats(Array.from(new Set(all.map(p => p.category))).sort());
  }, []);

  const labelize = (key: string) => {
    switch (key) {
      case 'tshirt': return 'T-Shirts';
      case 'trouser': return 'Trousers';
      case 'hoodies': return 'Hoodies';
      case 'chinos': return 'Chinos';
      case 'cargos': return 'Cargos';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="category-dropdown">
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
              <Link href="/retail" onClick={closeDropdown} className="category-link">All Products</Link>
            </li>
            {cats.map((key) => (
              <li key={key}>
                <Link 
                  href={`/retail?category=${encodeURIComponent(key)}`}
                  onClick={closeDropdown}
                  className="category-link"
                >
                  {labelize(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}