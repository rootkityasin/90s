import { NextRequest, NextResponse } from 'next/server';
import { listProducts, addProduct, updateProduct, deleteProduct } from '../../../../lib/data/store';
import { broadcastProductUpdate, broadcastProductDelete } from '../../../../lib/realtime';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

// GET - List all products
export async function GET(request: NextRequest) {
  try {
    const products = await listProducts();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[POST /api/admin/products] Request body:', JSON.stringify(body).substring(0, 200));
    
    // Validate required fields
    if (!body.title) {
      console.error('[POST] Missing title');
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    if (!body.category) {
      console.error('[POST] Missing category');
      return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 });
    }
    if (!body.productCode) {
      console.error('[POST] Missing productCode');
      return NextResponse.json({ success: false, error: 'Product code is required' }, { status: 400 });
    }
    if (!body.base || (body.base !== 'retail' && body.base !== 'client')) {
      console.error('[POST] Invalid base:', body.base);
      return NextResponse.json({ success: false, error: 'Base must be either "retail" or "client"' }, { status: 400 });
    }
    if (!body.variants || body.variants.length === 0) {
      console.error('[POST] No variants');
      return NextResponse.json({ success: false, error: 'At least one variant is required' }, { status: 400 });
    }

    // Generate slug from productCode if not provided
    const slug = body.productCode.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Set hero image to first image if not provided
    const heroImage = body.heroImage || (body.images && body.images.length > 0 ? body.images[0] : '');
    
    const productData = {
      slug,
      title: body.title,
      description: body.description || '',
      subCategory: body.subCategory,
      productCode: body.productCode,
      fabricDetails: body.fabricDetails,
      careInstructions: body.careInstructions,
      category: body.category,
      base: body.base || 'retail', // Default to retail if not specified
      heroImage,
      images: body.images || [],
      variants: body.variants
    };

    const newProduct = await addProduct(productData);
    
    console.log('[POST] Product created successfully:', newProduct.productCode);
    
    // Revalidate pages
    revalidatePath('/retail');
    revalidatePath('/client/catalog');
    revalidatePath('/admin');
    
    // Broadcast update
    broadcastProductUpdate(newProduct);
    
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/admin/products] Error:', error);
    console.error('[POST /api/admin/products] Stack:', error.stack);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create product',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// PUT - Update existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.productCode) {
      return NextResponse.json({ success: false, error: 'Product code is required' }, { status: 400 });
    }

    const productCode = body.productCode;
    
    // Prepare update data (exclude productCode from patch since it's the identifier)
    const { productCode: _, ...updateData } = body;
    
    const updatedProduct = await updateProduct(productCode, updateData);
    
    if (!updatedProduct) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    // Revalidate pages
    revalidatePath('/retail');
    revalidatePath('/client/catalog');
    revalidatePath('/admin');
    
    // Broadcast update
    broadcastProductUpdate(updatedProduct);
    
    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Remove product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productCode = searchParams.get('productCode');
    
    if (!productCode) {
      return NextResponse.json({ success: false, error: 'Product code is required' }, { status: 400 });
    }

    const success = await deleteProduct(productCode);
    
    if (!success) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    // Revalidate pages
    revalidatePath('/retail');
    revalidatePath('/client/catalog');
    revalidatePath('/admin');
    
    // Broadcast delete
    broadcastProductDelete(productCode);
    
    return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
