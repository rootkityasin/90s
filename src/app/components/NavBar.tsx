"use client";
import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { CategoryDropdown } from './CategoryDropdown';
import { useRouter, usePathname } from 'next/navigation';
import Lottie from 'lottie-react';
import searchAnimation from '../../../public/assets/animation/search.json';

export function NavBar({ role, clientAccess: _clientAccess }: { role?: string; clientAccess?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = React.useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const lottieRef = React.useRef<any>(null);
  const [animationPaused, setAnimationPaused] = React.useState(false);

  // Handle animation completion
  const handleAnimationComplete = () => {
    setAnimationPaused(true);
    setTimeout(() => {
      if (lottieRef.current) {
        lottieRef.current.goToAndPlay(0, true);
        setAnimationPaused(false);
      }
    }, 2000); // 2 second pause at the end
  };

  // Lottie options for search animation
  const lottieOptions = {
    loop: false, // We'll handle looping manually
    autoplay: true,
    animationData: searchAnimation,
    onComplete: handleAnimationComplete,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  // Set animation speed after component mounts
  React.useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.3); // Very slow speed
    }
  }, []);

  const isClientContext = pathname.startsWith('/client');
  const isAdminContext = pathname.startsWith('/admin');

  const navContext: 'retail' | 'client' | 'admin' = (() => {
    if (role === 'admin' || isAdminContext) return 'admin';
    if (isClientContext) return 'client';
    return 'retail';
  })();

  const logoHref = navContext === 'admin' ? '/admin' : navContext === 'client' ? '/client' : '/';
  const homeHref = logoHref;
  const dropdownTarget = navContext === 'client' ? 'client' : 'retail';
  const searchBase = navContext === 'client' ? '/client/search' : '/search';
  const aboutHref = navContext === 'client' ? '/client/about' : '/about';
  const contactHref = navContext === 'client' ? '/client/contact' : '/contact';

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    // Close mobile menu (if open) and dismiss keyboard
    closeMobileMenu();
    if (document && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (!term) return;
    router.push(`${searchBase}?q=${encodeURIComponent(term)}`);
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
    // Toggle body class to prevent scrolling when mobile menu is open
    if (!mobileMenuOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }
  }

  // Close mobile menu when clicking on a link
  function closeMobileMenu() {
    setMobileMenuOpen(false);
    document.body.classList.remove('nav-open');
  }


  return (
    <nav className="site-nav primary-nav">
      <div className="nav-left">
        <Link href={logoHref} className="logo" aria-label="Go home" onClick={closeMobileMenu}>
          <span className="logo-text">90's Legacy</span>
        </Link>
      </div>
      <div className="nav-center">
        <ul className="nav-menu" role="menubar">
          <li><Link href={homeHref} role="menuitem" onClick={closeMobileMenu}>Home</Link></li>
          <li><CategoryDropdown target={dropdownTarget} /></li>
          <li><Link href={aboutHref} role="menuitem" onClick={closeMobileMenu}>About</Link></li>
          <li><Link href={contactHref} role="menuitem" onClick={closeMobileMenu}>Contact</Link></li>
        </ul>
      </div>
      <div className="nav-right" style={{ display:'flex', alignItems:'center', gap:'.9rem' }}>
        {/* Desktop / tablet search (hidden on mobile) */}
        <div className="desktop-only">
          <form onSubmit={submit} className="nav-search" role="search" aria-label="Site search">
            <div className="search-icon" aria-hidden="true">
              <Lottie 
                {...lottieOptions}
                lottieRef={lottieRef}
                className="search-lottie"
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </form>
        </div>

        {/* Mobile-only: show Categories button instead of search */}
        <div className="mobile-only">
          <CategoryDropdown target={dropdownTarget} />
        </div>
        {/* Mobile hamburger menu button */}
        <button 
          className="nav-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <div className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </div>
        </button>
      </div>
      {/* Mobile navigation links */}
      <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Mobile search inside the hamburger menu */}
        <form onSubmit={submit} className="nav-search nav-links-search" role="search" aria-label="Site search">
          <div className="search-icon" aria-hidden="true">
            <Lottie 
              {...lottieOptions}
              lottieRef={lottieRef}
              className="search-lottie"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <input
            type="text"
            placeholder="Search products"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>
        <Link href={homeHref} onClick={closeMobileMenu}>Home</Link>
  <Link href={aboutHref} onClick={closeMobileMenu}>About</Link>
  <Link href={contactHref} onClick={closeMobileMenu}>Contact</Link>
      </div>
    </nav>
  );
}
