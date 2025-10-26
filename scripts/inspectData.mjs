// View and fix existing data structure
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

async function inspectAndFixData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');
    
    const db = client.db('90s-store');
    const productsCol = db.collection('products');
    
    // Get one product to see structure
    const sampleProduct = await productsCol.findOne({});
    console.log('📦 Sample Product Structure:');
    console.log(JSON.stringify(sampleProduct, null, 2));
    
    console.log('\n📝 All Products:');
    const allProducts = await productsCol.find({}).toArray();
    allProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${JSON.stringify(p, null, 2)}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

inspectAndFixData();
