import { NextRequest } from 'next/server';
import cloudinary from '../../../lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary environment variables not set');
      return new Response(
        JSON.stringify({ 
          error: 'Image upload not configured. Please set CLOUDINARY environment variables in Vercel.' 
        }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const form = await req.formData();
    const file = form.get('file');
    
    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: '90s-store/products', // Organize images in folder
          resource_type: 'auto',
          // No transformation - keep original resolution
          quality: 'auto:best', // Best quality, no compression
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    });

    const result = uploadResponse as any;
    
    // Return Cloudinary URL
    return new Response(
      JSON.stringify({ 
        path: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height
      }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (e: any) {
    console.error('❌ Upload error:', e);
    return new Response(
      JSON.stringify({ 
        error: e.message || 'Upload failed',
        details: 'Check Vercel logs for details. Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in Vercel environment variables.'
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
