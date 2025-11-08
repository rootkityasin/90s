import { NextRequest, NextResponse } from 'next/server';
import { listProductsByBase, getProductByCode, getProductBySKU, generateClientToken } from '../../../../lib/data/store';

export const dynamic = 'force-dynamic';

// GET - List all products (client view - tokens instead of prices)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get('productCode');
    const sku = searchParams.get('sku');
    
    if (productCode) {
      // Get single product by productCode
      const product = await getProductByCode(productCode);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      
      // Only return if it's a client product
      if (product.base !== 'client') {
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
      const product = await getProductBySKU(sku);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      
      // Only return if it's a client product
      if (product.base !== 'client') {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      
      const variant = product.variants.find(v => v.sku === sku);
      return NextResponse.json({ 
        success: true, 
        product,
        variant: variant ? { ...variant, token: generateClientToken(variant.sku) } : null
      }, { status: 200 });
    }
    
    // Get all client products
    const products = await listProductsByBase('client');
    const categoriesAll = Array.from(new Set(products.map(p => p.category).filter((c): c is string => Boolean(c)))).sort((a, b) => a.localeCompare(b));
    const categoryTree = Object.fromEntries(categoriesAll.map(cat => [
      cat,
      Array.from(new Set(products
        .filter(p => p.category === cat && p.subCategory)
        .map(p => p.subCategory as string)
      )).sort((a, b) => a.localeCompare(b))
    ]));
    const subCategoriesAll = Array.from(new Set(products
      .map(p => p.subCategory)
      .filter((s): s is string => Boolean(s))
    )).sort((a, b) => a.localeCompare(b));
    
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
    
    return NextResponse.json({
      success: true,
      products: productsWithTokens,
      total: filtered.length,
      categories: categoriesAll,
      subCategories: subCategoriesAll,
      categoryTree
    }, { status: 200 });
  } catch (error: any) {
    console.error('Client products error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
