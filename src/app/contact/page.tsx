import React from 'react';
import { WHATSAPP_PHONE, FACEBOOK_PAGE_URL } from '../../lib/config';

export const metadata = { title: "Contact | 90's Legacy" };

export default function ContactPage() {
  return (
    <div className="container" style={{ marginTop:'1.6rem', marginBottom:'4rem' }}>
      <div className="panel textured" style={{ padding:'2.2rem 2.4rem 2.6rem', maxWidth:880, margin:'0 auto' }}>
        <h1 className="header-accent" style={{ fontSize:'2.2rem', margin:'0 0 1.2rem' }}>Contact</h1>
        <p style={{ fontSize:'.85rem', lineHeight:1.5, maxWidth:640 }}>Reach out for sourcing briefs, sampling windows, pricing questions or collaboration proposals. Fastest response via WhatsApp. Provide SKU/token references if you already explored product listings.</p>
        <ul style={{ listStyle:'none', padding:0, margin:'1.4rem 0 2.2rem', display:'grid', gap:'.8rem', fontSize:'.8rem' }}>
          <li><strong>WhatsApp:</strong> <a href={`https://wa.me/${WHATSAPP_PHONE}?text=Hi%20I%20want%20to%20discuss%20sourcing`} target="_blank" rel="noreferrer">{WHATSAPP_PHONE}</a></li>
          <li><strong>Facebook:</strong> <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noreferrer">Page Link</a></li>
          <li><strong>Email:</strong> <a href="mailto:info@example.com">info@example.com</a></li>
        </ul>
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
          <button type="submit" style={{ width:'fit-content', padding:'.7rem 1.4rem', fontSize:'.75rem', letterSpacing:'.8px' }}>Send (stub)</button>
        </form>
      </div>
    </div>
  );
}