import './globals.css';
import React from 'react';
import { cookies } from 'next/headers';
import { NavBar } from './components';
import { CartProvider } from './components/cart/CartContext';
import { FloatingCartButton } from './components/cart/FloatingCartButton';

export const metadata = {
  title: "90's Commerce",
  description: "Regional & wholesale fashion platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const role = cookies().get('role')?.value;
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <NavBar role={role} />
          {children}
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
