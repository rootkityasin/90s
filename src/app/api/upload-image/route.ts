import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g,'_');
    const filename = `${Date.now()}-${safeName}`;
    const fullPath = path.join(uploadsDir, filename);
  // Cast to any to satisfy TS in this constrained environment
  await writeFile(fullPath, buffer as any);
    const publicPath = `/uploads/${filename}`;
    return new Response(JSON.stringify({ path: publicPath }), { status: 200, headers: { 'Content-Type':'application/json' }});
  } catch (e:any) {
    return new Response(JSON.stringify({ error: e.message || 'Upload failed' }), { status: 500 });
  }
}
