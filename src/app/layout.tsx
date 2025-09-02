import './globals.css';
import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import Script from 'next/script';

export const metadata = {
  title: "90's Commerce",
  description: "Regional & wholesale fashion platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const role = cookies().get('role')?.value;
  return (
    <html lang="en">
      <body>
        <nav className="site-nav" style={{ background:'transparent', boxShadow:'none', padding:'1rem 2rem', display:'flex', alignItems:'center', gap:'1.4rem' }}>
          <Link href="/" className="logo">
            <img src="/logo.png" alt="90's Legacy" />
            <span>90's Legacy</span>
          </Link>
          <button className="nav-toggle" type="button" onClick={() => {
            const list = document.querySelector('.nav-links');
            const open = list?.classList.toggle('open');
            document.body.classList.toggle('nav-open', !!open);
          }}>Menu</button>
          <div className="nav-links" onClick={e => {
            if((e.target as HTMLElement).tagName === 'A'){
              const list = document.querySelector('.nav-links');
              list?.classList.remove('open');
              document.body.classList.remove('nav-open');
            }
          }}>
            <Link href="/retail">Retail</Link>
            <Link href="/client">Client</Link>
            <Link href="/admin">Admin</Link>
            {role ? <Link href="/logout">Logout</Link> : <Link href="/login">Login</Link>}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
