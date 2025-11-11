import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NavBar } from './components';
import Footer from './components/Footer';
import { CartProvider } from './components/cart/CartContext';
import { FloatingCartButton } from './components/cart/FloatingCartButton';
import BodyWrapper from './components/BodyWrapper';
import { CLIENT_COOKIE_NAME } from '../lib/auth/clientGate';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "90's Commerce",
  description: "Regional fashion platform for clients",
  icons: {
    icon: '/uploads/1757075817333-BB9B9396-9B40-47FC-AB87-B6AB4D80698C.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const role = cookieStore.get('role')?.value;
  const clientAccess = cookieStore.get(CLIENT_COOKIE_NAME)?.value === 'granted';

  const footerExcluded = React.Children.toArray(children).some((child: any) => {
    return child?.props?.['data-no-footer'] !== undefined ||
      (child?.props?.children && React.Children.toArray(child.props.children).some((c: any)=> c?.props?.['data-no-footer'] !== undefined));
  });

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/assets/textures/home-hero.jpg" />
        <link rel="preload" as="image" href="/assets/textures/paper.webp" type="image/webp" />
        <link rel="preload" as="image" href="/assets/textures/detailed_grunge_texture_background_3012.jpg" />
      </head>
      <BodyWrapper>
        <CartProvider>
          <NavBar role={role} clientAccess={clientAccess} />
          {children}
          {!footerExcluded && <Footer role={role} clientAccess={clientAccess} />}
          <FloatingCartButton />
          <SpeedInsights />
          <Analytics />
        </CartProvider>
      </BodyWrapper>
    </html>
  );
}
