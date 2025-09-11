import './globals.css';
import React from 'react';
import { cookies } from 'next/headers';
import { NavBar } from './components';
import Footer from './components/Footer';
import { CartProvider } from './components/cart/CartContext';
import { FloatingCartButton } from './components/cart/FloatingCartButton';

export const metadata = {
  title: "90's Commerce",
  description: "Regional & wholesale fashion platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const role = cookies().get('role')?.value;
  // Determine pathname via dynamic import of next/headers not available here; instead rely on client-side hook is overkill.
  // Simpler approach: don't render footer on known sections by checking a data attribute we set in pages if needed.
  // For now, always show footer; pages that shouldn't have it (admin, product list pages) will opt out by wrapping content in a fragment with data-no-footer.
  // Detect that flag here.
  // We'll inspect rendered children for a data-no-footer marker (simple string search on SSR children) – lightweight heuristic.
  const footerExcluded = React.Children.toArray(children).some((child: any) => {
    return child?.props?.['data-no-footer'] !== undefined ||
      (child?.props?.children && React.Children.toArray(child.props.children).some((c: any)=> c?.props?.['data-no-footer'] !== undefined));
  });
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <NavBar role={role} />
          {children}
          {!footerExcluded && <Footer />}
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
