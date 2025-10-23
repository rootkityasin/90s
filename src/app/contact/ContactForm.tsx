"use client";

import React from 'react';

export default function ContactForm() {
  return (
    <form style={{ display:'grid', gap:'1rem', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))' }} onSubmit={(e)=>e.preventDefault()}>
      <label style={{ display:'grid', gap:'.3rem', fontSize:'.65rem', letterSpacing:1, textTransform:'uppercase' }}>Name
        <input required placeholder="Your Name" />
      </label>
      <label style={{ display:'grid', gap:'.3rem', fontSize:'.65rem', letterSpacing:1, textTransform:'uppercase' }}>Email
        <input type="email" required placeholder="you@brand.com" />
      </label>
      <label style={{ gridColumn:'1 / -1', display:'grid', gap:'.3rem', fontSize:'.65rem', letterSpacing:1, textTransform:'uppercase' }}>Message
        <textarea rows={5} placeholder="Brief project details, quantities, target cost, timeline..."></textarea>
      </label>
      <button type="submit" style={{ width:'fit-content', padding:'.7rem 1.4rem', fontSize:'.75rem', letterSpacing:'.8px' }}>Send</button>
    </form>
  );
}
