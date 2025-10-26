import { NextRequest, NextResponse } from 'next/server';
import { listProductsByBase, getProductByCode } from '../../../../lib/data/store';

export const dynamic = 'force-dynamic';

// GET - List all products (retail view - prices visible)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get('productCode');
    
    if (productCode) {
      // Get single product by productCode
      const product = await getProductByCode(productCode);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      // Only return if it's a retail product
      if (product.base !== 'retail') {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product }, { status: 200 });
    }
    
    // Get all retail products
    const products = await listProductsByBase('retail');
    
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
