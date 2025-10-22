import './globals.css';
import React from 'react';
import { cookies } from 'next/headers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NavBar } from './components';
import Footer from './components/Footer';
import { CartProvider } from './components/cart/CartContext';
import { FloatingCartButton } from './components/cart/FloatingCartButton';
import BodyWrapper from './components/BodyWrapper';
import { CLIENT_COOKIE_NAME } from '../lib/auth/clientGate';

export const metadata = {
  title: "90's Commerce",
  description: "Regional fashion platform for clients"
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
      <BodyWrapper>
        <CartProvider>
          <NavBar role={role} clientAccess={clientAccess} />
          {children}
          {!footerExcluded && <Footer role={role} clientAccess={clientAccess} />}
          <FloatingCartButton />
          <SpeedInsights />
        </CartProvider>
      </BodyWrapper>
    </html>
  );
}
