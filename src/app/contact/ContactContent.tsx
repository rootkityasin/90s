import React from 'react';
import { WHATSAPP_PHONE, FACEBOOK_PAGE_URL } from '../../lib/config';
import ContactForm from './ContactForm';

export function ContactContent() {
  return (
    <div className="container" style={{ marginTop: '1.6rem', marginBottom: '4rem' }}>
      <div className="panel textured" style={{ padding: '2.2rem 2.4rem 2.6rem', maxWidth: 880, margin: '0 auto' }}>
        <h1 className="hero-headline about-hero-title">Contact</h1>
        <p style={{ fontSize: '.85rem', lineHeight: 1.5, maxWidth: 640 }}>
          Reach out for sourcing briefs, sampling windows, pricing questions or collaboration proposals. Fastest response via WhatsApp. Provide SKU/token references if you already explored product listings.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '1.4rem 0 2.2rem', display: 'grid', gap: '.8rem', fontSize: '.8rem' }}>
          <li><strong>WhatsApp:</strong> <a href={`https://wa.me/${WHATSAPP_PHONE}?text=Hi%20I%20want%20to%20discuss%20sourcing`} target="_blank" rel="noreferrer">{WHATSAPP_PHONE}</a></li>
          <li><strong>Facebook:</strong> <a href={FACEBOOK_PAGE_URL} target="_blank" rel="noreferrer">Page Link</a></li>
          <li><strong>Email:</strong> <a href="mailto:info@example.com">info@example.com</a></li>
        </ul>
        <ContactForm />
      </div>
    </div>
  );
}
