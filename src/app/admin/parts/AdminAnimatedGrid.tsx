"use client";
import React from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../../../lib/types';
import { formatCategoryLabel } from '../../../lib/formatCategoryLabel';

const container = { hidden:{}, show:{ transition:{ staggerChildren:0.07 } } };
const item = { hidden:{ opacity:0, y:18, scale:.95 }, show:{ opacity:1, y:0, scale:1, transition:{ duration:.5, ease:[0.22,0.68,0,1] } } };

export default function AdminAnimatedGrid({ products, onFullEdit }: { products: Product[]; onFullEdit?: (p: Product) => void }) {
  return (
    <motion.div className="grid" variants={container} initial="hidden" animate="show">
      {products.map(p => (
        <motion.div key={p.id} className="card" variants={item} whileHover={{ y:-6 }}>
          <div style={{ position: 'relative' }}>
            <img src={p.heroImage} alt="" style={{ width:'100%', height:120, objectFit:'cover', borderRadius:6 }} />
            {p.base && (
              <span style={{ 
                position: 'absolute', 
                top: 6, 
                right: 6, 
                background: p.base === 'retail' ? '#2563eb' : '#16a34a', 
                color: '#fff', 
                fontSize: '.55rem', 
                padding: '3px 8px', 
                borderRadius: 4, 
                fontWeight: 600,
                letterSpacing: '.5px',
                textTransform: 'uppercase'
              }}>
                {p.base}
              </span>
            )}
          </div>
          <h3 style={{ marginTop:'.5rem', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.15rem', letterSpacing: '0.5px' }}>{p.title}</h3>
          <p style={{ fontSize:'.65rem' }}>{formatCategoryLabel(p.category, p.subCategory)}</p>
          {p.productCode && <p style={{ fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', opacity:.7 }}>Code: {p.productCode}</p>}
          <p style={{ fontSize:'.7rem' }}>Variants: {p.variants.length}</p>
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
