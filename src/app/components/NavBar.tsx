"use client";
import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { CategoryDropdown } from './CategoryDropdown';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import searchAnimation from '../../../public/assets/animation/search.json';

export function NavBar({ role }: { role?: string }) {
  const router = useRouter();
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    // Close mobile menu (if open) and dismiss keyboard
    closeMobileMenu();
    if (document && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
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
        <Link href="/" className="logo" aria-label="Go home" onClick={closeMobileMenu}>
          <span className="logo-text">90's Legacy</span>
        </Link>
      </div>
      <div className="nav-center">
        <ul className="nav-menu" role="menubar">
          <li><Link href="/" role="menuitem" onClick={closeMobileMenu}>Home</Link></li>
          <li><CategoryDropdown /></li>
          <li><Link href="/about" role="menuitem" onClick={closeMobileMenu}>About</Link></li>
          <li><Link href="/contact" role="menuitem" onClick={closeMobileMenu}>Contact</Link></li>
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
          <CategoryDropdown />
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
        <Link href="/" onClick={closeMobileMenu}>Home</Link>
        <Link href="/about" onClick={closeMobileMenu}>About</Link>
        <Link href="/contact" onClick={closeMobileMenu}>Contact</Link>
      </div>
    </nav>
  );
}
