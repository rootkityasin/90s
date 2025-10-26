"use client";
import React, { useState } from 'react';
import type { Product, Variant } from '../../../lib/types';
import { fullEditProduct } from '../actions';
import DeleteButton from './DeleteButton';
import { useRouter } from 'next/navigation';

export default function FullEditForm({ product, onClose }: { product: Product; onClose?: () => void }) {
  const router = useRouter();
  const [variants, setVariants] = useState<Variant[]>(product.variants);
  const [images, setImages] = useState<string[]>(product.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [productCode, setProductCode] = useState(product.productCode || '');

  // Color options
  const colorOptions = ['Black', 'White', 'Gray', 'Navy', 'Khaki', 'Olive', 'Brown', 'Beige', 'Red', 'Blue', 'Green'];
  
  // Size options
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];

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
    const newIndex = variants.length;
    const suffix = newIndex === 0 ? '' : `-${newIndex + 1}`;
    const sku = productCode ? `${productCode.toUpperCase()}${suffix}` : '';
    setVariants(v => [...v, { id: crypto.randomUUID(), sku, color:'', size:'', retailPriceBDT:0 }]);
  };
  const updateVariant = (i: number, patch: Partial<Variant>) => {
    setVariants(v => v.map((vv,idx) => idx===i? { ...vv, ...patch }: vv));
  };
  const removeVariant = (i: number) => setVariants(v => v.filter((_,idx)=>idx!==i));

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    
    // Validate images
    if (images.length === 0) {
      alert('Please upload at least 1 image');
      setSaving(false);
      return;
    }
    
    // Validate all variants have required fields
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.sku) {
        alert(`Variant ${i + 1}: SKU is required`);
        setSaving(false);
        return;
      }
      if (!v.color) {
        alert(`Variant ${i + 1}: Color is required`);
        setSaving(false);
        return;
      }
      if (!v.size) {
        alert(`Variant ${i + 1}: Size is required`);
        setSaving(false);
        return;
      }
      if (!v.retailPriceBDT || v.retailPriceBDT <= 0) {
        alert(`Variant ${i + 1}: Price must be greater than 0`);
        setSaving(false);
        return;
      }
    }
    
    try {
      const result = await fullEditProduct(formData);
      if (result.product) {
        // Close modal first
        if (onClose) {
          onClose();
        }
        
        // Show success notification
        const event = new CustomEvent('productUpdated', { detail: { product: result.product } });
        window.dispatchEvent(event);
        
        // Refresh to show changes
        router.refresh();
      } else if (result.error) {
        alert(`Error: ${result.error}`);
        setSaving(false);
      } else {
        // No product returned but no error - likely a timeout or network issue
        alert('Save may have timed out. Please refresh the page to check if changes were saved.');
        setSaving(false);
      }
    } catch (error: any) {
      console.error('Full edit error:', error);
      alert(`Failed to save changes: ${error.message || 'Unknown error'}`);
      setSaving(false);
    }
  };

  return (
    <>
      <style jsx>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <form action={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.2rem', maxWidth:1000 }}>
      {/* Use productCode as productId for tracking */}
      <input type="hidden" name="productId" value={product.productCode!} />
      <div style={{ display:'grid', gap:'.8rem', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))' }}>
        <label style={fieldLabelStyle}>
          <span className="flab">Base</span>
          <select name="base" defaultValue={product.base} required style={inputBoxStyle}>
            <option value="">Select base...</option>
            <option value="retail">Retail</option>
            <option value="client">Client (Wholesale)</option>
          </select>
        </label>
        <label style={fieldLabelStyle}><span className="flab">Title</span><input name="title" defaultValue={product.title} required style={inputBoxStyle} /></label>
        <label style={fieldLabelStyle}><span className="flab">Category</span><input name="category" defaultValue={product.category} required style={inputBoxStyle} /></label>
  <label style={fieldLabelStyle}><span className="flab">Subcategory</span><input name="subCategory" defaultValue={product.subCategory || ''} style={inputBoxStyle} placeholder="e.g. Baggy" /></label>
  <label style={fieldLabelStyle}><span className="flab">Product Code</span><input name="productCode" defaultValue={product.productCode || ''} style={inputBoxStyle} placeholder="Short code e.g. TRS-01" /></label>
        <label style={fieldLabelStyle}><span className="flab">Hero Image (Auto)</span><input name="heroImage" defaultValue={product.heroImage} required style={{ ...inputBoxStyle, background: '#f5f5f5', cursor: 'not-allowed' }} readOnly /></label>
        <label style={{ ...fieldLabelStyle, gridColumn:'1 / -1' }}><span className="flab">Description</span><textarea name="description" rows={3} defaultValue={product.description} style={{ ...inputBoxStyle, resize:'vertical' }} /></label>
        <label style={{ ...fieldLabelStyle, gridColumn:'1 / -1' }}><span className="flab">Fabric Details *</span><textarea name="fabricDetails" rows={2} defaultValue={product.fabricDetails} style={{ ...inputBoxStyle, resize:'vertical' }} required /></label>
        <label style={{ ...fieldLabelStyle, gridColumn:'1 / -1' }}><span className="flab">Care Instructions</span><textarea name="careInstructions" rows={2} defaultValue={product.careInstructions} style={{ ...inputBoxStyle, resize:'vertical' }} /></label>
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
                <button type="button" onClick={()=>removeImage(idx)} title="Delete" style={buttonStyles.danger}>Del</button>
                <button type="button" onClick={()=>setAsHero(idx)} title="Set as hero" style={buttonStyles.success}>Hero</button>
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
        <legend style={{ fontSize:'.8rem', padding:'0 .4rem' }}>Variants *</legend>
        <input type="hidden" name="variantCount" value={variants.length} />
        <div style={{ display:'grid', gap:'.75rem' }}>
          {variants.map((v,i) => (
            <div key={v.id} className="variant-row">
              <input type="hidden" name={`variant_id_${i}`} value={v.id} />
              <label>
                SKU *
                <input 
                  name={`variant_sku_${i}`} 
                  value={v.sku} 
                  onChange={e=>updateVariant(i,{sku:e.target.value})} 
                  required 
                  style={inputBoxStyle} 
                />
              </label>
              <label>
                Color *
                <select 
                  name={`variant_color_${i}`} 
                  value={v.color} 
                  onChange={e=>updateVariant(i,{color:e.target.value})} 
                  style={inputBoxStyle}
                  required
                >
                  <option value="">Choose color...</option>
                  {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label>
                Size *
                <select 
                  name={`variant_size_${i}`} 
                  value={v.size} 
                  onChange={e=>updateVariant(i,{size:e.target.value})} 
                  style={inputBoxStyle}
                  required
                >
                  <option value="">Choose size...</option>
                  {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label>
                Price (BDT) *
                <input 
                  name={`variant_price_${i}`} 
                  type="number" 
                  value={v.retailPriceBDT || ''} 
                  onChange={e=>updateVariant(i,{retailPriceBDT:parseInt(e.target.value,10)||0})} 
                  style={inputBoxStyle}
                  required
                  min="1"
                />
              </label>
              {variants.length > 1 && (
                <button 
                  type="button" 
                  onClick={()=>removeVariant(i)} 
                  style={buttonStyles.small}
                  title="Remove variant"
                >×</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addVariant} style={buttonStyles.secondary}>+ Add Another Variant</button>
        </div>
      </fieldset>

      <div style={{ display:'flex', gap:'.6rem', justifyContent:'space-between', alignItems: 'center' }}>
        <DeleteButton productId={product.productCode!} />
        <button type="submit" disabled={saving} style={{ ...buttonStyles.primary, opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
    </>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  display:'flex',
  flexDirection:'column',
  gap:'.25rem',
  fontSize:'.65rem'
};

const inputBoxStyle: React.CSSProperties = {
  background:'#1e2b4f',
  border:'1px solid #2d3d63',
  color:'#fff',
  padding:'.4rem .5rem',
  borderRadius:6,
  fontSize:'.7rem',
  width:'100%',
  outline:'none',
  boxShadow:'0 0 0 1px #1c2844 inset',
  height:'32px',
  boxSizing:'border-box'
};

// Modern button styles
const buttonStyles = {
  primary: {
    background: 'linear-gradient(135deg, #008F7D 0%, #00A38A 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '.75rem 1.2rem',
    fontSize: '.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,143,125,0.3)',
  } as React.CSSProperties,
  secondary: {
    background: 'linear-gradient(135deg, #2d3d63 0%, #384a6b 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '.5rem .8rem',
    fontSize: '.7rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  } as React.CSSProperties,
  danger: {
    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '.3rem .5rem',
    fontSize: '.6rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(197,48,48,0.3)',
  } as React.CSSProperties,
  success: {
    background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '.3rem .5rem',
    fontSize: '.6rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(56,161,105,0.3)',
  } as React.CSSProperties,
  small: {
    background: 'linear-gradient(135deg, #4a5568 0%, #5a6675 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    height: '32px',
    width: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  } as React.CSSProperties
};
