import './globals.css';
import React from 'react';
import { cookies } from 'next/headers';
import { NavBar } from './components';

export const metadata = {
  title: "90's Commerce",
  description: "Regional & wholesale fashion platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const role = cookies().get('role')?.value;
  return (
    <html lang="en">
      <body>
  <NavBar role={role} />
        {children}
      </body>
    </html>
  );
}
