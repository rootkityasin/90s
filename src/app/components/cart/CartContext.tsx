"use client";
import React from 'react';
import type { Product, Variant } from '../../../lib/types';

export interface CartItem {
  id: string; // product id
  slug: string;
  title: string;
  variantSku: string;
  size: string;
  color: string;
  qty: number;
  priceBDT: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  add: (p: Product, variant: Variant, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  totalQty: number;
  totalBDT: number;
}

const CartCtx = React.createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  const add = React.useCallback((p: Product, v: Variant, qty: number) => {
    setItems(curr => {
      const existing = curr.find(i => i.variantSku === v.sku);
      if (existing) {
        return curr.map(i => i.variantSku === v.sku ? { ...i, qty: i.qty + qty } : i);
      }
      return [...curr, { id: p.id, slug: p.slug, title: p.title, variantSku: v.sku, size: v.size, color: v.color, qty, priceBDT: v.retailPriceBDT, image: p.heroImage }];
    });
  }, []);
  const remove = React.useCallback((sku: string) => setItems(c => c.filter(i => i.variantSku !== sku)), []);
  const clear = React.useCallback(() => setItems([]), []);
  const totalQty = items.reduce((s,i)=>s+i.qty,0);
  const totalBDT = items.reduce((s,i)=>s+i.qty*i.priceBDT,0);

  return <CartCtx.Provider value={{ items, add, remove, clear, totalQty, totalBDT }}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
