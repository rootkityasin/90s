"use client";
import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { useRouter } from 'next/navigation';

export function NavBar({ role }: { role?: string }) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }
  return (
    <nav className="site-nav primary-nav">
      <div className="nav-left">
        <Link href="/" className="logo" aria-label="Go home">
          <span className="logo-mark"><Logo size={30} withBackground={false} color="#000" /></span>
          <span className="logo-text">90's Legacy</span>
        </Link>
      </div>
      <div className="nav-center">
        <ul className="nav-menu" role="menubar">
          <li><Link href="/" role="menuitem">Home</Link></li>
          <li><Link href="/about" role="menuitem">About</Link></li>
          <li><Link href="/contact" role="menuitem">Contact</Link></li>
        </ul>
      </div>
      <div className="nav-right">
        <form onSubmit={submit} className="nav-search" role="search" aria-label="Site search">
          <span className="icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>
      </div>
    </nav>
  );
}
