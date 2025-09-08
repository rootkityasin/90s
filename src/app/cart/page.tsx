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
        <div className="empty-cart-container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">
              <img 
                src="/assets/animation/empty cart.gif" 
                alt="Empty cart animation"
                className="empty-cart-gif"
              />
            </div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-subtitle">
              Looks like you haven't added anything to your cart yet. 
              Let's change that!
            </p>
            <div className="empty-cart-animation">
              <div className="floating-items">
                <span className="item">👕</span>
                <span className="item">👖</span>
                <span className="item">👟</span>
                <span className="item">🧢</span>
                <span className="item">👜</span>
              </div>
            </div>
            <Link href="/retail" className="empty-cart-button">
              Start Shopping
            </Link>
            <div className="empty-cart-suggestions">
              <p>Popular picks:</p>
              <div className="suggestion-tags">
                <Link href="/retail" className="tag">Vintage Tees</Link>
                <Link href="/retail" className="tag">Retro Jackets</Link>
                <Link href="/retail" className="tag">90s Accessories</Link>
              </div>
            </div>
          </div>
        </div>
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
