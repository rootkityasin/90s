// Test product code tracking
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function testProductCodeTracking() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('90s-store');
    const productsCol = db.collection('products');
    
    // Test 1: Find by productCode
    console.log('📦 Test 1: Finding product by productCode (CHINONAVY)');
    const product1 = await productsCol.findOne({ productCode: 'CHINONAVY' });
    if (product1) {
      console.log(`   ✅ Found: ${product1.title}`);
      console.log(`   - ID: ${product1.id}`);
      console.log(`   - Slug: ${product1.slug}`);
      console.log(`   - Product Code: ${product1.productCode}`);
    } else {
      console.log('   ❌ Not found');
    }
    
    // Test 2: List all products with their tracking identifiers
    console.log('\n📋 Test 2: All products with tracking identifiers');
    const allProducts = await productsCol.find({}).toArray();
    allProducts.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title}`);
      console.log(`      🔑 Product Code: ${p.productCode} (PRIMARY)`);
      console.log(`      🔗 Slug: ${p.slug} (fallback)`);
      console.log(`      🆔 ID: ${p.id} (internal)`);
    });
    
    // Test 3: Check uniqueness of productCode
    console.log('\n🔍 Test 3: Checking productCode uniqueness');
    const codes = allProducts.map(p => p.productCode);
    const uniqueCodes = new Set(codes);
    if (codes.length === uniqueCodes.size) {
      console.log(`   ✅ All product codes are unique (${codes.length} products)`);
    } else {
      console.log(`   ⚠️ Duplicate product codes found!`);
    }
    
    // Test 4: Check if all products have productCode
    console.log('\n✓ Test 4: Checking productCode coverage');
    const withoutCode = allProducts.filter(p => !p.productCode);
    if (withoutCode.length === 0) {
      console.log(`   ✅ All products have productCode`);
    } else {
      console.log(`   ⚠️ ${withoutCode.length} products missing productCode:`);
      withoutCode.forEach(p => console.log(`      - ${p.title} (slug: ${p.slug})`));
    }
    
    console.log('\n' + '═'.repeat(50));
    console.log('✨ Product tracking now uses productCode as primary identifier');
    console.log('   Priority order: productCode → id → slug');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

testProductCodeTracking();
