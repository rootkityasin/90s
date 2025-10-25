import { NextRequest, NextResponse } from 'next/server';
import { listProducts, getProductBySlug, getProductBySKU, generateClientToken } from '../../../../lib/data/store';

export const dynamic = 'force-dynamic';

// GET - List all products (client view - tokens instead of prices)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const sku = searchParams.get('sku');
    
    if (slug) {
      // Get single product by slug
      const product = getProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      
      // Add tokens to variants for client view
      const productWithTokens = {
        ...product,
        variants: product.variants.map(v => ({
          ...v,
          token: generateClientToken(v.sku)
        }))
      };
      
      return NextResponse.json({ success: true, product: productWithTokens }, { status: 200 });
    }
    
    if (sku) {
      // Get product by SKU and return with token
      const product = getProductBySKU(sku);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      
      const variant = product.variants.find(v => v.sku === sku);
      return NextResponse.json({ 
        success: true, 
        product,
        variant: variant ? { ...variant, token: generateClientToken(variant.sku) } : null
      }, { status: 200 });
    }
    
    // Get all products
    const products = listProducts();
    
    // Optional filters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let filtered = products;
    
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.productCode?.toLowerCase().includes(searchLower)
      );
    }
    
    // Add tokens to all variants for client view
    const productsWithTokens = filtered.map(p => ({
      ...p,
      variants: p.variants.map(v => ({
        ...v,
        token: generateClientToken(v.sku)
      }))
    }));
    
    return NextResponse.json({ success: true, products: productsWithTokens, total: filtered.length }, { status: 200 });
  } catch (error: any) {
    console.error('Client products error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
