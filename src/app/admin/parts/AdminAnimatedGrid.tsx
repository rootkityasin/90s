"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../../lib/types';
import { editProduct } from '../actions';
import { useRouter } from 'next/navigation';

const container = { hidden:{}, show:{ transition:{ staggerChildren:0.07 } } };
const item = { hidden:{ opacity:0, y:18, scale:.95 }, show:{ opacity:1, y:0, scale:1, transition:{ duration:.5, ease:[0.22,0.68,0,1] } } };

export default function AdminAnimatedGrid({ products, onFullEdit }: { products: Product[]; onFullEdit?: (p: Product) => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);

  const handleQuickEdit = async (productSlug: string, formData: FormData) => {
    setSaving(productSlug);
    try {
      await editProduct(productSlug, formData);
      router.refresh();
    } catch (error) {
      console.error('Quick edit error:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(null);
    }
  };

  return (
    <motion.div className="grid" variants={container} initial="hidden" animate="show">
      {products.map(p => (
        <motion.div key={p.id} className="card" variants={item} whileHover={{ y:-6 }}>
          <img src={p.heroImage} alt="" style={{ width:'100%', height:120, objectFit:'cover', borderRadius:6 }} />
          <h3 style={{ marginTop:'.5rem' }}>{p.title}</h3>
          <p style={{ fontSize:'.65rem' }}>{p.subCategory ? `${p.category} • ${p.subCategory}` : p.category}</p>
          {p.productCode && <p style={{ fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', opacity:.7 }}>Code: {p.productCode}</p>}
          <p style={{ fontSize:'.7rem' }}>Variants: {p.variants.length}</p>
          <details style={{ marginTop:'.6rem' }}>
            <summary style={{ cursor:'pointer', fontSize:'.7rem' }}>Quick Edit</summary>
            <form action={(fd) => handleQuickEdit(p.slug, fd)} style={{ display:'grid', gap:'.4rem', marginTop:'.5rem' }}>
              <input name="title" placeholder="Title" defaultValue={p.title} />
              <input name="heroImage" placeholder="Hero Image URL" defaultValue={p.heroImage} />
              <textarea name="description" placeholder="Description" rows={2} defaultValue={p.description} />
              <input name="productCode" placeholder="Product Code" defaultValue={p.productCode || ''} />
              <button type="submit" disabled={saving === p.slug} style={{ fontSize:'.7rem', padding:'.4rem .6rem', opacity: saving === p.slug ? 0.6 : 1 }}>
                {saving === p.slug ? 'Saving...' : 'Save'}
              </button>
            </form>
          </details>
          {onFullEdit && (
            <button type="button" onClick={() => onFullEdit(p)} style={{ display:'inline-block', marginTop:'.5rem', fontSize:'.65rem', background:'#1e2b4f', color:'#fff', padding:'.4rem .65rem', borderRadius:6, cursor: 'pointer' }}>
              Full Edit →
            </button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
