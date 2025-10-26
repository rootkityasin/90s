import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test MongoDB connection
    const mongoConnected = process.env.MONGODB_URI ? true : false;
    
    // Test Cloudinary
    const cloudinaryConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      services: {
        mongodb: mongoConnected ? '✅ Connected' : '❌ Not configured',
        cloudinary: cloudinaryConfigured ? '✅ Configured' : '❌ Not configured'
      },
      endpoints: {
        health: '/api/health',
        testCloudinary: '/api/test-cloudinary',
        adminProducts: '/api/admin/products',
        uploadImage: '/api/upload-image'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
