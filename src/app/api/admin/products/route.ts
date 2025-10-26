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
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    if (!body.category) {
      return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 });
    }
    if (!body.variants || body.variants.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one variant is required' }, { status: 400 });
    }

    // Generate slug if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
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
    
    // Revalidate pages
    revalidatePath('/retail');
    revalidatePath('/client/catalog');
    revalidatePath('/admin');
    
    // Broadcast update
    broadcastProductUpdate(newProduct);
    
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create product' }, { status: 500 });
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
