'use server';
import { revalidatePath } from 'next/cache';

// Helper to make internal API calls that work in both localhost and Vercel
async function internalFetch(path: string, options: RequestInit) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  
  const url = `${baseUrl}${path}`;
  return fetch(url, options);
}

export async function createProduct(formData: FormData) {
  const title = (formData.get('title') || '').toString();
  if (!title) return { error: 'Title required' };
  
  const productCode = (formData.get('productCode') || '').toString();
  if (!productCode) return { error: 'Product Code required' };
  
  // Auto-generate slug from productCode
  const slug = productCode.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const description = (formData.get('description') || '').toString();
  const subCategory = (formData.get('subCategory') || '').toString();
  const fabricDetails = (formData.get('fabricDetails') || '').toString();
  const careInstructions = (formData.get('careInstructions') || '').toString();
  const category = (formData.get('category') || '').toString();
  const base = (formData.get('base') || 'retail').toString() as 'retail' | 'client';
  
  if (!base || (base !== 'retail' && base !== 'client')) {
    return { error: 'Base must be either "retail" or "client"' };
  }
  
  // Handle images (comma separated)
  const imagesCSV = (formData.get('images') || '').toString();
  const images = imagesCSV.trim() ? imagesCSV.split(',').map(s=>s.trim()).filter(Boolean) : [];
  
  // Hero image defaults to first uploaded image or manual input
  let heroImage = (formData.get('heroImage') || '').toString();
  if (!heroImage && images.length > 0) {
    heroImage = images[0];
  }
  
  // Handle variants
  const variantCount = parseInt((formData.get('variantCount') || '0').toString(),10);
  const variants: any[] = [];
  for (let i=0;i<variantCount;i++) {
    const id = (formData.get(`variant_id_${i}`)||'').toString() || crypto.randomUUID();
    const sku = (formData.get(`variant_sku_${i}`)||'').toString();
    if(!sku) continue; // skip empty rows
    variants.push({
      id,
      sku,
      color: (formData.get(`variant_color_${i}`)||'').toString(),
      size: (formData.get(`variant_size_${i}`)||'').toString(),
      retailPriceBDT: parseInt((formData.get(`variant_price_${i}`)||'0').toString(),10) || 0
    });
  }
  
  // Ensure at least one variant exists
  if (variants.length === 0) {
    return { error: 'At least one variant with SKU is required' };
  }
  
  try {
    const response = await internalFetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        title,
        description,
        subCategory,
        productCode,
        fabricDetails,
        careInstructions,
        category,
        base,
        heroImage,
        images,
        variants
      }),
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    if (!data.success) {
      return { error: data.error || 'Failed to create product' };
    }
    
    return { product: data.product };
  } catch (error: any) {
    console.error('[createProduct] Error:', error);
    return { error: error.message || 'Failed to create product' };
  }
}

export async function editProduct(productCode: string, formData: FormData) {
  console.log('[editProduct] Updating product with code:', productCode);
  
  const patch: any = { productCode };
  if (formData.get('title')) patch.title = formData.get('title');
  if (formData.get('description')) patch.description = formData.get('description');
  if (formData.get('subCategory') !== null) patch.subCategory = formData.get('subCategory');
  if (formData.get('productCode') !== null) patch.productCode = formData.get('productCode');
  if (formData.get('fabricDetails') !== null) patch.fabricDetails = formData.get('fabricDetails');
  if (formData.get('careInstructions') !== null) patch.careInstructions = formData.get('careInstructions');
  if (formData.get('heroImage')) patch.heroImage = formData.get('heroImage');
  
  console.log('[editProduct] Patch data:', Object.keys(patch));
  
  try {
    const response = await internalFetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    console.log('[editProduct] Response:', data.success ? 'SUCCESS' : 'FAILED');
    
    if (!data.success) {
      return { error: data.error || 'Failed to update product' };
    }
    
    return { product: data.product };
  } catch (error: any) {
    console.error('[editProduct] Error:', error);
    return { error: error.message || 'Failed to update product' };
  }
}

export async function fullEditProduct(formData: FormData) {
  try {
    const productCode = (formData.get('productId') || '').toString();
    console.log('[fullEditProduct] Editing product with code:', productCode);
    
    if (!productCode) return { error: 'Missing product identifier' };
    
    const patch: any = { productCode };
    const fields = ['title','description','category','heroImage','base'];
    const optionalTextFields = ['subCategory','productCode','fabricDetails','careInstructions'];
    
    fields.forEach(f => { 
      const val = formData.get(f);
      if (val !== null) patch[f] = val.toString(); 
    });
    optionalTextFields.forEach(f => { 
      const val = formData.get(f);
      if (val !== null) patch[f] = val.toString(); 
    });
    
    // Auto-generate slug from productCode if productCode is being updated
    if (patch.productCode) {
      patch.slug = patch.productCode.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    const imagesCSV = (formData.get('images') || '').toString();
    if (imagesCSV.trim()) {
      patch.images = imagesCSV.split(',').map(s=>s.trim()).filter(Boolean);
    }
    
    const variantCount = parseInt((formData.get('variantCount') || '0').toString(),10);
    const variants: any[] = [];
    for (let i=0;i<variantCount;i++) {
      const id = (formData.get(`variant_id_${i}`)||'').toString() || crypto.randomUUID();
      const sku = (formData.get(`variant_sku_${i}`)||'').toString();
      if(!sku) continue;
      variants.push({
        id,
        sku,
        color: (formData.get(`variant_color_${i}`)||'').toString(),
        size: (formData.get(`variant_size_${i}`)||'').toString(),
        retailPriceBDT: parseInt((formData.get(`variant_price_${i}`)||'0').toString(),10) || 0
      });
    }
    if (variants.length) patch.variants = variants;
    
    console.log('[fullEditProduct] Patch keys:', Object.keys(patch), 'variants:', variants.length);
    
    const response = await internalFetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    console.log('[fullEditProduct] Response:', data.success ? 'SUCCESS' : 'FAILED');
    
    if (!data.success) {
      return { error: data.error || 'Product not found or update failed' };
    }
    
    return { product: data.product };
  } catch (error: any) {
    console.error('[fullEditProduct] Error:', error);
    return { error: error.message || 'Update failed' };
  }
}

export async function deleteProduct(productCode: string) {
  if (!productCode) return { error: 'Missing product identifier' };
  
  try {
    const response = await internalFetch(`/api/admin/products?productCode=${encodeURIComponent(productCode)}`, {
      method: 'DELETE',
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    if (!data.success) {
      return { error: data.error || 'Failed to delete product' };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('[deleteProduct] Error:', error);
    return { error: error.message || 'Failed to delete product' };
  }
}
