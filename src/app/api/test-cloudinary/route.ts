import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const config = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
    apiKey: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
    apiSecret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
  };

  const allSet = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

  return NextResponse.json({
    status: allSet ? 'ok' : 'error',
    message: allSet 
      ? 'Cloudinary is properly configured' 
      : 'Cloudinary environment variables are missing',
    config,
    instructions: {
      step1: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables',
      step2: 'Add these variables:',
      variables: [
        'CLOUDINARY_CLOUD_NAME=dwrmfoq1a',
        'CLOUDINARY_API_KEY=692512442891449',
        'CLOUDINARY_API_SECRET=B6SW8zNtn6GCj8368dYwJYWzuWY'
      ],
      step3: 'Redeploy your application',
      note: 'These variables are already in your local .env.local file'
    }
  });
}
