"use client";
import React, { useState } from 'react';
import type { Product, Variant } from '../../../lib/types';
import { fullEditProduct } from '../actions';

export default function FullEditForm({ product }: { product: Product }) {
  const [variants, setVariants] = useState<Variant[]>(product.variants);
  const [images, setImages] = useState<string[]>(product.images || []);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploading(true);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload-image', { method:'POST', body: fd });
      if (res.ok) {
        const json = await res.json();
        if (json.path) added.push(json.path);
      }
    }
    setImages(prev => [...prev, ...added]);
    setUploading(false);
    e.target.value = '';
  }

  function removeImage(idx: number) {
    setImages(imgs => imgs.filter((_,i)=>i!==idx));
  }

  function setAsHero(idx: number) {
    const target = images[idx];
    // move selected to front and update hero input manually
    setImages(imgs => [target, ...imgs.filter((_,i)=>i!==idx)]);
    const heroInput = document.querySelector<HTMLInputElement>('input[name="heroImage"]');
    if (heroInput) heroInput.value = target;
  }

  const addVariant = () => {
    setVariants(v => [...v, { id: crypto.randomUUID(), sku:'', color:'', size:'', retailPriceBDT:0 }]);
  };
  const updateVariant = (i: number, patch: Partial<Variant>) => {
    setVariants(v => v.map((vv,idx) => idx===i? { ...vv, ...patch }: vv));
  };
  const removeVariant = (i: number) => setVariants(v => v.filter((_,idx)=>idx!==i));

  return (
    <form action={fullEditProduct} style={{ display:'flex', flexDirection:'column', gap:'1.4rem', maxWidth:1000 }}>
      <input type="hidden" name="productId" value={product.id} />
      <div style={{ display:'grid', gap:'1rem', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))' }}>
        <label style={fieldLabelStyle}><span className="flab">Tag Code</span><input name="slug" defaultValue={product.slug} required style={inputBoxStyle} /></label>
        <label style={fieldLabelStyle}><span className="flab">Title</span><input name="title" defaultValue={product.title} required style={inputBoxStyle} /></label>
        <label style={fieldLabelStyle}><span className="flab">Category</span><input name="category" defaultValue={product.category} required style={inputBoxStyle} /></label>
        <label style={fieldLabelStyle}><span className="flab">Hero Image</span><input name="heroImage" defaultValue={product.heroImage} required style={inputBoxStyle} /></label>
        <label style={{ ...fieldLabelStyle, gridColumn:'1 / -1' }}><span className="flab">Description</span><textarea name="description" rows={4} defaultValue={product.description} style={{ ...inputBoxStyle, resize:'vertical' }} /></label>
      </div>
      <div style={{ display:'grid', gap:'.75rem' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'.6rem', alignItems:'center' }}>
          <span style={{ fontSize:'.75rem', fontWeight:600 }}>Gallery Images</span>
          <label style={{ fontSize:'.6rem', cursor:'pointer', background:'#1e2b4f', color:'#fff', padding:'.35rem .6rem', borderRadius:6 }}>
            {uploading ? 'Uploading…' : 'Upload Images'}
            <input type="file" multiple accept="image/*" style={{ display:'none' }} onChange={handleUpload} disabled={uploading} />
          </label>
          <span style={{ fontSize:'.55rem', opacity:.6 }}>({images.length} total)</span>
        </div>
        {images.length === 0 && <p style={{ fontSize:'.65rem', opacity:.7 }}>No images yet. Use Upload Images to add.</p>}
        <div style={{ display:'grid', gap:'.6rem', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))' }}>
          {images.map((img, idx) => (
            <div key={img+idx} style={{ position:'relative', border:'1px solid #333', borderRadius:10, padding:6, background:'#101418', display:'flex', flexDirection:'column', gap:4 }}>
              <div style={{ position:'relative' }}>
                <img src={img} alt="" style={{ width:'100%', height:100, objectFit:'cover', borderRadius:6, boxShadow:'0 0 0 1px #222' }} />
                {idx===0 && <span style={{ position:'absolute', top:6, left:6, background:'#008F7D', color:'#fff', fontSize:'.55rem', padding:'2px 5px', borderRadius:4, letterSpacing:.5 }}>HERO</span>}
              </div>
              <div style={{ display:'flex', gap:4 }}>
                <button type="button" onClick={()=>removeImage(idx)} title="Delete" style={{ flex:1, background:'#612', color:'#fff', border:'none', borderRadius:4, fontSize:'.55rem', padding:'.3rem .35rem' }}>Del</button>
                <button type="button" onClick={()=>setAsHero(idx)} title="Set as hero" style={{ flex:1, background:'#0a462f', color:'#fff', border:'none', borderRadius:4, fontSize:'.55rem', padding:'.3rem .35rem' }}>Hero</button>
              </div>
              <code
                title={img}
                style={{
                  display:'block',
                  fontSize:'.6rem',
                  lineHeight:1.2,
                  whiteSpace:'nowrap',
                  overflow:'hidden',
                  textOverflow:'ellipsis',
                  background:'linear-gradient(135deg,#22315a,#1e2b4f)',
                  color:'#fff',
                  padding:'3px 6px',
                  borderRadius:6,
                  border:'1px solid #2f4475',
                  letterSpacing:'.3px'
                }}
              >{img}</code>
            </div>
          ))}
        </div>
        {/* Hidden input with CSV list for server action */}
        <input type="hidden" name="images" value={images.join(',')} />
      </div>

  <fieldset style={{ border:'1px solid #333', padding:'1rem', borderRadius:8 }}>
        <legend style={{ fontSize:'.8rem', padding:'0 .4rem' }}>Variants</legend>
        <input type="hidden" name="variantCount" value={variants.length} />
        <div style={{ display:'grid', gap:'.75rem' }}>
          {variants.map((v,i) => (
            <div key={v.id} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr)) 40px', gap:'.5rem', alignItems:'end' }}>
              <input type="hidden" name={`variant_id_${i}`} value={v.id} />
              <label style={{ fontSize:'.65rem' }}>SKU<input name={`variant_sku_${i}`} value={v.sku} onChange={e=>updateVariant(i,{sku:e.target.value})} required style={inputBoxStyle} /></label>
              <label style={{ fontSize:'.65rem' }}>Color<input name={`variant_color_${i}`} value={v.color} onChange={e=>updateVariant(i,{color:e.target.value})} style={inputBoxStyle} /></label>
              <label style={{ fontSize:'.65rem' }}>Size<input name={`variant_size_${i}`} value={v.size} onChange={e=>updateVariant(i,{size:e.target.value})} style={inputBoxStyle} /></label>
              <label style={{ fontSize:'.65rem' }}>Price<input name={`variant_price_${i}`} type="number" value={v.retailPriceBDT} onChange={e=>updateVariant(i,{retailPriceBDT:parseInt(e.target.value,10)||0})} style={inputBoxStyle} /></label>
              <button type="button" onClick={()=>removeVariant(i)} style={{ background:'#611', color:'#fff', border:'none', borderRadius:6, height:32 }}>×</button>
            </div>
          ))}
          <button type="button" onClick={addVariant} style={{ fontSize:'.7rem', width:'fit-content' }}>Add Variant</button>
        </div>
      </fieldset>

      <div style={{ display:'flex', gap:'.6rem', justifyContent:'flex-end' }}>
        <button type="submit" style={{ background:'#0a462f', color:'#fff', padding:'.7rem 1.1rem', borderRadius:8 }}>Save Changes</button>
      </div>
    </form>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  display:'flex',
  flexDirection:'column',
  gap:'.35rem',
  fontSize:'.65rem'
};

const inputBoxStyle: React.CSSProperties = {
  background:'#1e2b4f',
  border:'1px solid #2d3d63',
  color:'#fff',
  padding:'.55rem .65rem',
  borderRadius:8,
  fontSize:'.7rem',
  width:'100%',
  outline:'none',
  boxShadow:'0 0 0 1px #1c2844 inset'
};
