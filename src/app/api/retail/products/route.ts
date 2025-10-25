import { NextRequest, NextResponse } from 'next/server';
import { listProducts, getProductBySlug } from '../../../../lib/data/store';

export const dynamic = 'force-dynamic';

// GET - List all products (retail view - prices visible)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      // Get single product by slug
      const product = getProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product }, { status: 200 });
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
    
    return NextResponse.json({ success: true, products: filtered, total: filtered.length }, { status: 200 });
  } catch (error: any) {
    console.error('Retail products error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
