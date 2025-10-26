'use server';
import { revalidatePath } from 'next/cache';

// Server actions should call API routes directly, not via HTTP
// Import the API handler directly instead of using fetch
import { addProduct, updateProduct as updateProductInDB, deleteProduct as deleteProductFromDB } from '../../lib/data/store';
import { broadcastProductUpdate } from '../../lib/realtime';

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
    console.log('[createProduct] Creating product:', productCode);
    
    const productData = {
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
    };
    
    const newProduct = await addProduct(productData);
    
    console.log('[createProduct] Product created:', newProduct.id);
    
    // Revalidate pages
    revalidatePath('/retail');
    revalidatePath('/client/catalog');
    revalidatePath('/admin');
    
    // Broadcast update
    broadcastProductUpdate(newProduct);
    
    return { product: newProduct };
  } catch (error: any) {
    console.error('[createProduct] Error:', error);
    return { error: error.message || 'Failed to create product' };
  }
}

export async function editProduct(productCode: string, formData: FormData) {
  console.log('[editProduct] Updating product with code:', productCode);
  
  const patch: any = {};
  if (formData.get('title')) patch.title = formData.get('title');
  if (formData.get('description')) patch.description = formData.get('description');
  if (formData.get('subCategory') !== null) patch.subCategory = formData.get('subCategory');
  if (formData.get('productCode') !== null) patch.productCode = formData.get('productCode');
  if (formData.get('fabricDetails') !== null) patch.fabricDetails = formData.get('fabricDetails');
  if (formData.get('careInstructions') !== null) patch.careInstructions = formData.get('careInstructions');
  if (formData.get('heroImage')) patch.heroImage = formData.get('heroImage');
  
  console.log('[editProduct] Patch data:', Object.keys(patch));
  
  try {
    const updated = await updateProductInDB(productCode, patch);
    
    if (!updated) {
      return { error: 'Product not found' };
    }
    
    console.log('[editProduct] Success');
    
    revalidatePath('/admin');
    revalidatePath('/retail');
    revalidatePath('/client/catalog');
    
    broadcastProductUpdate(updated);
    
    return { product: updated };
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
    
    // Update product directly in database
    const updatedProduct = await updateProductInDB(productCode, patch);
    
    console.log('[fullEditProduct] Response:', updatedProduct ? 'SUCCESS' : 'FAILED');
    
    if (!updatedProduct) {
      return { error: 'Product not found or update failed' };
    }
    
    // Broadcast update to connected clients
    broadcastProductUpdate(updatedProduct);
    
    // Revalidate paths
    revalidatePath('/admin');
    revalidatePath('/retail');
    revalidatePath('/client/catalog');
    revalidatePath(`/retail/products/${updatedProduct.slug}`);
    revalidatePath(`/client/catalog/${updatedProduct.slug}`);
    
    return { product: updatedProduct };
  } catch (error: any) {
    console.error('[fullEditProduct] Error:', error);
    return { error: error.message || 'Update failed' };
  }
}

export async function deleteProduct(productCode: string) {
  if (!productCode) return { error: 'Missing product identifier' };
  
  try {
    // Delete product directly from database
    const success = await deleteProductFromDB(productCode);
    
    if (!success) {
      return { error: 'Failed to delete product' };
    }
    
    // Broadcast deletion to connected clients
    broadcastProductUpdate(null);
    
    // Revalidate paths
    revalidatePath('/admin');
    revalidatePath('/retail');
    revalidatePath('/client/catalog');
    
    return { success: true };
  } catch (error: any) {
    console.error('[deleteProduct] Error:', error);
    return { error: error.message || 'Failed to delete product' };
  }
}
