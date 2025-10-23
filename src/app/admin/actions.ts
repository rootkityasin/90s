'use server';
import { addProduct, updateProduct, deleteProduct as deleteProductFromStore, listProducts } from '../../lib/data/store';
import { broadcastProductUpdate, broadcastProductDelete } from '../../lib/realtime';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const title = (formData.get('title') || '').toString();
  if (!title) return { error: 'Title required' };
  const slug = (formData.get('slug') || title.toLowerCase().replace(/[^a-z0-9]+/g,'-')).toString();
  const description = (formData.get('description') || '').toString();
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
  
  const product = addProduct({ 
    slug, 
    title, 
    description, 
    fabricDetails,
    careInstructions,
    category, 
    heroImage,
    images,
    variants 
  });
  
  revalidatePath('/retail');
  revalidatePath('/client/catalog');
  revalidatePath('/admin');
  broadcastProductUpdate(product);
  return { product };
}

export async function editProduct(id: string, formData: FormData) {
  const patch: any = {};
  if (formData.get('title')) patch.title = formData.get('title');
  if (formData.get('description')) patch.description = formData.get('description');
  if (formData.get('fabricDetails') !== null) patch.fabricDetails = formData.get('fabricDetails');
  if (formData.get('careInstructions') !== null) patch.careInstructions = formData.get('careInstructions');
  if (formData.get('heroImage')) patch.heroImage = formData.get('heroImage');
  const updated = updateProduct(id, patch);
  revalidatePath('/retail');
  revalidatePath('/client/catalog');
  if (updated) broadcastProductUpdate(updated);
  return { product: updated };
}

export async function fullEditProduct(formData: FormData) {
  const productId = (formData.get('productId') || '').toString();
  if (!productId) return { error: 'Missing productId' };
  const patch: any = {};
  const fields = ['slug','title','description','category','heroImage'];
  const optionalTextFields = ['fabricDetails','careInstructions'];
  fields.forEach(f => { if (formData.get(f) !== null) patch[f] = formData.get(f); });
  optionalTextFields.forEach(f => { if (formData.get(f) !== null) patch[f] = formData.get(f); });
  // images (comma separated)
  const imagesCSV = (formData.get('images') || '').toString();
  if (imagesCSV.trim()) {
    patch.images = imagesCSV.split(',').map(s=>s.trim()).filter(Boolean);
  } else {
    patch.images = undefined; // allow clearing
  }
  // variants
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
  if (variants.length) patch.variants = variants;
  const updated = updateProduct(productId, patch);
  revalidatePath('/retail');
  revalidatePath('/client/catalog');
  revalidatePath('/admin');
  if (updated) broadcastProductUpdate(updated);
  return { product: updated };
}

export async function deleteProduct(productId: string) {
  if (!productId) return { error: 'Missing productId' };
  const success = deleteProductFromStore(productId);
  if (success) {
  revalidatePath('/retail');
  revalidatePath('/client/catalog');
  revalidatePath('/admin');
    broadcastProductDelete(productId);
    return { success: true };
  }
  return { error: 'Product not found' };
}
