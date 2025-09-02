"use client";
import React from 'react';
import { listProducts, generateWholesaleToken } from '../../lib/data/store';
import { ProductCard } from './ProductCard';
import { FadeUpDiv, Stagger } from './animations';

type ProductsPageProps = {
  title: string;
  description: string;
  mode: 'retail' | 'client'; // retail shows price, client shows token
};

// Simple wrapper component that handles fetching + layout + animations
export function ProductsPage({ title, description, mode }: ProductsPageProps) {
  const products = listProducts();
  const showPrice = mode === 'retail';
  return (
    <main className="container">
      <FadeUpDiv index={0}><h1 className={showPrice ? 'header-accent' : 'header-accent'}>{title}</h1></FadeUpDiv>
      <FadeUpDiv index={1}><p style={{ maxWidth:640, fontSize:'.8rem' }}>{description}</p></FadeUpDiv>
      <Stagger>
        <div className="grid" style={{ marginTop:'1.2rem' }}>
          {products.map(p => (
            <ProductCard
              key={p.id}
              p={p}
              showPrice={showPrice}
              token={!showPrice ? generateWholesaleToken(p.variants[0].sku) : undefined}
            />
          ))}
        </div>
      </Stagger>
    </main>
  );
}
