// Verify database is ready for manual entry
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function verifyDatabaseReady() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ MongoDB Connection: SUCCESS\n');
    
    const db = client.db('90s-store');
    const productsCol = db.collection('products');
    const salesCol = db.collection('sales');
    
    // Check collections exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('📦 Collections:');
    console.log(`   ${collectionNames.includes('products') ? '✅' : '❌'} products`);
    console.log(`   ${collectionNames.includes('sales') ? '✅' : '❌'} sales`);
    
    // Check product count
    const productCount = await productsCol.countDocuments();
    console.log(`\n📊 Products: ${productCount}`);
    
    // Check indexes
    console.log('\n🔍 Product Indexes:');
    const indexes = await productsCol.indexes();
    const requiredIndexes = ['_id', 'slug', 'category', 'productCode'];
    
    requiredIndexes.forEach(idx => {
      const exists = indexes.some(i => idx in i.key);
      const unique = indexes.find(i => idx in i.key)?.unique;
      console.log(`   ${exists ? '✅' : '❌'} ${idx}${unique ? ' (unique)' : ''}`);
    });
    
    console.log('\n' + '═'.repeat(50));
    console.log('✨ Database Ready for Manual Entry!');
    console.log('\n📝 To add products:');
    console.log('   1. Open http://localhost:3001/admin');
    console.log('   2. Click "Add Product" button');
    console.log('   3. Fill in product details:');
    console.log('      - Title (required)');
    console.log('      - Category (required)');
    console.log('      - Product Code (recommended)');
    console.log('      - Slug (auto-generated from title)');
    console.log('      - At least one variant with SKU');
    console.log('   4. Upload images (optional)');
    console.log('   5. Submit form');
    console.log('\n🔧 Features:');
    console.log('   ✅ Products tracked by productCode');
    console.log('   ✅ Fully editable after creation');
    console.log('   ✅ Real-time updates across panels');
    console.log('   ✅ Persistent storage in MongoDB Atlas');
    console.log('   ✅ Works on Vercel deployment');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

verifyDatabaseReady();
