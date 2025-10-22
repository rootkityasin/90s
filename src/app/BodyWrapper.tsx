"use client";

import { usePathname } from 'next/navigation';
import { Inter, Roboto_Mono, Syne } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
});

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <body
      className={`${inter.variable} ${roboto_mono.variable} ${syne.variable} font-sans ${isHomePage ? 'home-hero' : ''}`}
    >
      {children}
    </body>
  );
}
