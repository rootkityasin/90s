// Show what MongoDB actually stores
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function showMongoDBSchema() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('90s-store');
    
    console.log('📦 PRODUCTS COLLECTION');
    console.log('═'.repeat(50));
    console.log('MongoDB stores product METADATA only:\n');
    
    console.log('Example Product Document:');
    console.log(JSON.stringify({
      "_id": "ObjectId (MongoDB generated)",
      "id": "uuid-string",
      "slug": "cargo-pants-olive",
      "title": "Cargo Pants - Olive",
      "description": "Classic olive cargo pants",
      "subCategory": null,
      "productCode": "CARGOPANTSOL",
      "fabricDetails": "95% Cotton / 5% Elastane...",
      "careInstructions": "Cold wash, inside out...",
      "category": "cargos",
      "heroImage": "/uploads/1234567890-image.jpg",  // ← Just the PATH
      "images": [
        "/uploads/1234567890-image1.jpg",            // ← Just the PATHS
        "/uploads/1234567890-image2.jpg"
      ],
      "variants": [
        {
          "id": "variant-uuid",
          "sku": "CARGO-PANTS-OLIVE-M",
          "color": "assorted",
          "size": "M",
          "retailPriceBDT": 2200
        }
      ],
      "createdAt": "2025-10-26T10:00:00.000Z",
      "updatedAt": "2025-10-26T10:00:00.000Z"
    }, null, 2));
    
    console.log('\n' + '═'.repeat(50));
    console.log('🖼️  IMAGE STORAGE');
    console.log('═'.repeat(50));
    console.log('MongoDB stores: PATH ONLY (string)');
    console.log('   Example: "/uploads/1698765432-product.jpg"\n');
    
    console.log('Actual image file stored:');
    console.log('   Current: public/uploads/ (local filesystem) ❌ Won\'t work on Vercel');
    console.log('   Needed: Cloud storage (Cloudinary/Vercel Blob/S3) ✅\n');
    
    console.log('📊 SALES COLLECTION');
    console.log('═'.repeat(50));
    console.log('Example Sales Document:');
    console.log(JSON.stringify({
      "_id": "ObjectId (MongoDB generated)",
      "date": "2025-10-26",
      "orders": 15,
      "revenueBDT": 45000
    }, null, 2));
    
    console.log('\n' + '═'.repeat(50));
    console.log('💾 WHAT MONGODB STORES:');
    console.log('═'.repeat(50));
    console.log('✅ Product information (text data)');
    console.log('   - Title, description, category');
    console.log('   - Product codes, slugs');
    console.log('   - Fabric details, care instructions');
    console.log('');
    console.log('✅ Variant information');
    console.log('   - SKUs, sizes, colors');
    console.log('   - Prices in BDT');
    console.log('');
    console.log('✅ Image PATHS (strings)');
    console.log('   - "/uploads/filename.jpg"');
    console.log('   - NOT the actual image file');
    console.log('');
    console.log('✅ Sales data');
    console.log('   - Daily order counts');
    console.log('   - Revenue figures');
    console.log('');
    console.log('❌ DOES NOT STORE:');
    console.log('   - Actual image files (binary data)');
    console.log('   - User uploaded pictures');
    console.log('   - Media files');
    
    console.log('\n' + '═'.repeat(50));
    console.log('📈 STORAGE BREAKDOWN:');
    console.log('═'.repeat(50));
    
    const stats = await db.stats();
    console.log(`Database Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`Collections: ${stats.collections}`);
    console.log(`Storage Used: ${(stats.storageSize / 1024).toFixed(2)} KB`);
    console.log(`Free Tier: 512 MB (${((512 * 1024) - (stats.storageSize / 1024)).toFixed(2)} KB remaining)`);
    
    console.log('\n💡 SUMMARY:');
    console.log('   MongoDB = Structured data (JSON documents)');
    console.log('   Cloud Storage = Actual image files (JPG, PNG, etc.)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

showMongoDBSchema();
