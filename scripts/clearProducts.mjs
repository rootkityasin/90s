// Clear all products from MongoDB
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function clearProducts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('90s-store');
    const productsCol = db.collection('products');
    const salesCol = db.collection('sales');
    
    // Count existing data
    const productCount = await productsCol.countDocuments();
    const salesCount = await salesCol.countDocuments();
    
    console.log('📊 Current Database:');
    console.log(`   Products: ${productCount}`);
    console.log(`   Sales: ${salesCount}`);
    
    if (productCount === 0) {
      console.log('\n✨ Database is already empty!');
      return;
    }
    
    // Clear products
    console.log('\n🗑️  Clearing products...');
    const deleteResult = await productsCol.deleteMany({});
    console.log(`   ✅ Deleted ${deleteResult.deletedCount} products`);
    
    // Clear sales data (since products are gone)
    console.log('\n🗑️  Clearing sales data...');
    const salesResult = await salesCol.deleteMany({});
    console.log(`   ✅ Deleted ${salesResult.deletedCount} sales records`);
    
    // Verify
    const finalProductCount = await productsCol.countDocuments();
    const finalSalesCount = await salesCol.countDocuments();
    
    console.log('\n📊 Final Database:');
    console.log(`   Products: ${finalProductCount}`);
    console.log(`   Sales: ${finalSalesCount}`);
    
    // Check indexes are still there
    console.log('\n🔍 Verifying indexes still exist:');
    const indexes = await productsCol.indexes();
    indexes.forEach(idx => {
      const keys = Object.keys(idx.key).join(', ');
      const unique = idx.unique ? ' (unique)' : '';
      console.log(`   ✅ ${keys}${unique}`);
    });
    
    console.log('\n' + '═'.repeat(50));
    console.log('✨ Database cleared successfully!');
    console.log('📝 You can now add new products from admin panel');
    console.log('🔧 All indexes preserved for data integrity');
    console.log('💾 Structure ready for manual entry');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Connection closed');
  }
}

clearProducts();
