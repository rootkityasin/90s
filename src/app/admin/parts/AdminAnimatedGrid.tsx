"use client";
import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../../lib/types';
import { editProduct } from '../actions';

const container = { hidden:{}, show:{ transition:{ staggerChildren:0.07 } } };
const item = { hidden:{ opacity:0, y:18, scale:.95 }, show:{ opacity:1, y:0, scale:1, transition:{ duration:.5, ease:[0.22,0.68,0,1] } } };

export default function AdminAnimatedGrid({ products }: { products: Product[] }) {
  return (
    <motion.div className="grid" variants={container} initial="hidden" animate="show">
      {products.map(p => (
        <motion.div key={p.id} className="card" variants={item} whileHover={{ y:-6 }}>
          <img src={p.heroImage} alt="" style={{ width:'100%', height:120, objectFit:'cover', borderRadius:6 }} />
          <h3 style={{ marginTop:'.5rem' }}>{p.title}</h3>
          <p style={{ fontSize:'.65rem' }}>{p.category}</p>
          <p style={{ fontSize:'.7rem' }}>Variants: {p.variants.length}</p>
          <details style={{ marginTop:'.6rem' }}>
            <summary style={{ cursor:'pointer', fontSize:'.7rem' }}>Quick Edit</summary>
            <form action={(fd) => editProduct(p.id, fd)} style={{ display:'grid', gap:'.4rem', marginTop:'.5rem' }}>
              <input name="title" placeholder="Title" defaultValue={p.title} />
              <input name="heroImage" placeholder="Hero Image URL" defaultValue={p.heroImage} />
              <textarea name="description" placeholder="Description" rows={2} defaultValue={p.description} />
              <button type="submit" style={{ fontSize:'.7rem', padding:'.4rem .6rem' }}>Save</button>
            </form>
          </details>
        </motion.div>
      ))}
    </motion.div>
  );
}
