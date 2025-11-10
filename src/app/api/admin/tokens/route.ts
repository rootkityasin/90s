import { NextRequest, NextResponse } from 'next/server';
import { getClientTokenRecord, getProductBySKU } from '../../../../lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token')?.trim();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token query parameter is required' }, { status: 400 });
    }

    const record = await getClientTokenRecord(token);
    if (!record) {
      return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
    }

    const product = await getProductBySKU(record.sku);
    const variant = product?.variants.find(v => v.sku === record.sku) ?? product?.variants[0] ?? null;

    return NextResponse.json({
      success: true,
      record,
      product: product ?? null,
      variant: variant ?? null
    }, { status: 200 });
  } catch (error: any) {
    console.error('Admin token lookup error:', error);
    return NextResponse.json({ success: false, error: error?.message ?? 'Failed to lookup token' }, { status: 500 });
  }
}
