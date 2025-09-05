"use client";
import React from 'react';
import { useCart } from '../components/cart/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, totalQty, totalBDT, remove, clear } = useCart();
  return (
    <main className="container">
      <h1 className='header-accent' style={{ marginTop:0 }}>Cart</h1>
      {items.length === 0 && (
        <p style={{ fontSize:'.8rem' }}>Cart is empty. <Link href="/retail">Browse products</Link></p>
      )}
      {items.length > 0 && (
        <div style={{ marginTop:'1rem', display:'grid', gap:'1rem' }}>
          {items.map(it => (
            <div key={it.variantSku} style={{ display:'flex', gap:'1rem', background:'var(--color-surface)', padding:'.9rem 1rem', borderRadius:16, alignItems:'center', boxShadow:'0 4px 10px -6px rgba(0,0,0,.3)' }}>
              <img src={it.image} alt={it.title} style={{ width:72, height:72, objectFit:'cover', borderRadius:12 }} />
              <div style={{ flex:1 }}>
                <strong style={{ fontSize:'.8rem' }}>{it.title}</strong>
                <div style={{ fontSize:'.6rem', letterSpacing:'.5px', marginTop:4 }}>Size: {it.size} • Color: {it.color}</div>
                <div style={{ fontSize:'.65rem', marginTop:4 }}>Qty: {it.qty} × ৳ {it.priceBDT}</div>
              </div>
              <div style={{ fontWeight:600, fontSize:'.75rem' }}>৳ {it.qty * it.priceBDT}</div>
              <button onClick={()=>remove(it.variantSku)} style={{ background:'#b32626' }}>X</button>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--color-surface)', padding:'1rem 1.2rem', borderRadius:18 }}>
            <div style={{ fontSize:'.7rem', letterSpacing:'.6px' }}>Items: {totalQty} • Total: <strong>৳ {totalBDT}</strong></div>
            <div style={{ display:'flex', gap:'.6rem' }}>
              <button className='secondary' onClick={clear} style={{ background:'#333' }}>Clear</button>
              <button>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
