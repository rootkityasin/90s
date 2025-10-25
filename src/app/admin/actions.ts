'use server';
import { revalidatePath } from 'next/cache';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function createProduct(formData: FormData) {
  const title = (formData.get('title') || '').toString();
  if (!title) return { error: 'Title required' };
  const slug = (formData.get('slug') || title.toLowerCase().replace(/[^a-z0-9]+/g,'-')).toString();
  const description = (formData.get('description') || '').toString();
  const subCategory = (formData.get('subCategory') || '').toString();
  const productCode = (formData.get('productCode') || '').toString();
  const fabricDetails = (formData.get('fabricDetails') || '').toString();
  const careInstructions = (formData.get('careInstructions') || '').toString();
  const category = (formData.get('category') || '').toString();
  
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
    const response = await fetch(`${API_BASE}/api/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, title, description, subCategory, productCode, fabricDetails, careInstructions, category, heroImage, images, variants }),
      cache: 'no-store'
    });
    const data = await response.json();
    if (!data.success) return { error: data.error || 'Failed to create product' };
    return { product: data.product };
  } catch (error: any) {
    return { error: error.message || 'Failed to create product' };
  }
}

export async function editProduct(slug: string, formData: FormData) {
  const patch: any = { slug };
  if (formData.get('title')) patch.title = formData.get('title');
  if (formData.get('description')) patch.description = formData.get('description');
  if (formData.get('subCategory') !== null) patch.subCategory = formData.get('subCategory');
  if (formData.get('productCode') !== null) patch.productCode = formData.get('productCode');
  if (formData.get('fabricDetails') !== null) patch.fabricDetails = formData.get('fabricDetails');
  if (formData.get('careInstructions') !== null) patch.careInstructions = formData.get('careInstructions');
  if (formData.get('heroImage')) patch.heroImage = formData.get('heroImage');
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
      cache: 'no-store'
    });
    const data = await response.json();
    if (!data.success) return { error: data.error || 'Failed to update product' };
    return { product: data.product };
  } catch (error: any) {
    return { error: error.message || 'Failed to update product' };
  }
}

export async function fullEditProduct(formData: FormData) {
  try {
    const productSlug = (formData.get('productId') || '').toString();
    if (!productSlug) return { error: 'Missing product identifier' };
    
    const patch: any = { slug: productSlug };
    const fields = ['slug','title','description','category','heroImage'];
    const optionalTextFields = ['subCategory','productCode','fabricDetails','careInstructions'];
    fields.forEach(f => { 
      const val = formData.get(f);
      if (val !== null) patch[f] = val.toString(); 
    });
    optionalTextFields.forEach(f => { 
      const val = formData.get(f);
      if (val !== null) patch[f] = val.toString(); 
    });
    
    const imagesCSV = (formData.get('images') || '').toString();
    patch.images = imagesCSV.trim() ? imagesCSV.split(',').map(s=>s.trim()).filter(Boolean) : [];
    
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
    
    const response = await fetch(`${API_BASE}/api/admin/products`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
      cache: 'no-store'
    });
    const data = await response.json();
    if (!data.success) return { error: data.error || 'Product not found or update failed' };
    return { product: data.product };
  } catch (error: any) {
    return { error: error.message || 'Update failed' };
  }
}

export async function deleteProduct(productSlug: string) {
  if (!productSlug) return { error: 'Missing product identifier' };
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/products?slug=${encodeURIComponent(productSlug)}`, {
      method: 'DELETE',
      cache: 'no-store'
    });
    const data = await response.json();
    if (!data.success) return { error: data.error || 'Failed to delete product' };
    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete product' };
  }
}
