'use server';
import { addProduct, updateProduct } from '../../lib/data/store';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const title = (formData.get('title') || '').toString();
  if (!title) return { error: 'Title required' };
  const slug = (formData.get('slug') || title.toLowerCase().replace(/[^a-z0-9]+/g,'-')).toString();
  const description = (formData.get('description') || '').toString();
  const category = (formData.get('category') || '').toString();
  const heroImage = (formData.get('heroImage') || '').toString();
  const price = parseInt((formData.get('price') || '0').toString(), 10);
  const variantSku = (formData.get('sku') || '').toString();
  const color = (formData.get('color') || '').toString();
  const size = (formData.get('size') || '').toString();
  const product = addProduct({ slug, title, description, category, heroImage, variants: [ { id: crypto.randomUUID(), sku: variantSku, color, size, retailPriceBDT: price } ] });
  revalidatePath('/retail');
  revalidatePath('/client');
  return { product };
}

export async function editProduct(id: string, formData: FormData) {
  const patch: any = {};
  if (formData.get('title')) patch.title = formData.get('title');
  if (formData.get('description')) patch.description = formData.get('description');
  if (formData.get('heroImage')) patch.heroImage = formData.get('heroImage');
  const updated = updateProduct(id, patch);
  revalidatePath('/retail');
  revalidatePath('/client');
  return { product: updated };
}
