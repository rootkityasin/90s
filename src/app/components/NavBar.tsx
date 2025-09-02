"use client";
import React from 'react';
import Link from 'next/link';

export function NavBar({ role }: { role?: string }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (open) document.body.classList.add('nav-open'); else document.body.classList.remove('nav-open');
  }, [open]);
  function handleNavClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).tagName === 'A') setOpen(false);
  }
  return (
    <nav className="site-nav" style={{ background:'transparent', boxShadow:'none', padding:'1rem 2rem', display:'flex', alignItems:'center', gap:'1.4rem' }}>
      <Link href="/" className="logo" onClick={() => setOpen(false)}>
        <img src="/logo.png" alt="90's Legacy" />
        <span>90's Legacy</span>
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-label="Toggle navigation menu"
        onClick={() => setOpen(o => !o)}
      >
        Menu
      </button>
      <div className={`nav-links${open ? ' open' : ''}`} onClick={handleNavClick}>
        <Link href="/retail">Retail</Link>
        <Link href="/client">Client</Link>
        <Link href="/admin">Admin</Link>
        {role ? <Link href="/logout">Logout</Link> : <Link href="/login">Login</Link>}
      </div>
    </nav>
  );
}
