import { NextRequest, NextResponse } from 'next/server';
import { getProductBySKU, createClientTokenRecord } from '../../../../lib/data/store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const skuRaw = typeof payload?.sku === 'string' ? payload.sku.trim() : '';
    const quantityRaw = payload?.quantity;
    const quantity = Number.parseInt(String(quantityRaw), 10);
    const client = payload?.client ?? {};

    if (!skuRaw) {
      return NextResponse.json({ success: false, error: 'SKU is required' }, { status: 400 });
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ success: false, error: 'Quantity must be a positive number' }, { status: 400 });
    }
    if (!client?.name || !client?.email || !client?.phone || !client?.address) {
      return NextResponse.json({ success: false, error: 'Client name, email, phone, and address are required' }, { status: 400 });
    }

    const product = await getProductBySKU(skuRaw);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found for SKU provided' }, { status: 404 });
    }

    const variant = product.variants.find(v => v.sku === skuRaw) ?? product.variants[0];
    if (!variant) {
      return NextResponse.json({ success: false, error: 'Variant not found for SKU provided' }, { status: 404 });
    }

    const record = await createClientTokenRecord({
      sku: skuRaw,
      productId: product.id,
      productCode: product.productCode,
      variantId: variant.id,
      quantity,
      color: payload?.color ?? variant.color,
      size: payload?.size ?? variant.size,
      client,
      productSnapshot: {
        productTitle: product.title,
        heroImage: product.heroImage,
        productSlug: product.slug,
        productCode: product.productCode
      }
    });

    return NextResponse.json({
      success: true,
      token: record.token,
      record,
      product,
      variant
    }, { status: 201 });
  } catch (error: any) {
    console.error('Client token creation error:', error);
    return NextResponse.json({ success: false, error: error?.message ?? 'Failed to create client token' }, { status: 500 });
  }
}
