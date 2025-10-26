// MongoDB database initialization script (without server-only restriction)
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables from .env.local
config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  console.error('Please create .env.local with your MongoDB connection string');
  process.exit(1);
}

const basePrice = { 
  cargos: 2200, 
  chinos: 2000, 
  tshirt: 950, 
  hoodies: 2600, 
  trouser: 2400 
};

const DEFAULT_FABRIC_DETAILS = '95% Cotton / 5% Elastane (example) • Pre-washed • Colorfast • Soft hand-feel.';
const DEFAULT_CARE_INSTRUCTIONS = 'Care: Cold wash, inside out, no bleach, tumble dry low.';

// Simple product manifest (inline for initialization)
function generateProducts() {
  return [
    { slug: 'cargo-pants-olive', title: 'Cargo Pants - Olive', category: 'cargos', heroImage: '/images/cargo-pants-olive.jpg', images: ['/images/cargo-pants-olive.jpg'], description: 'Classic olive cargo pants' },
    { slug: 'chino-navy', title: 'Chino - Navy', category: 'chinos', heroImage: '/images/chino-navy.jpg', images: ['/images/chino-navy.jpg'], description: 'Navy blue chinos' },
    { slug: 'basic-tshirt-white', title: 'Basic T-Shirt - White', category: 'tshirt', heroImage: '/images/basic-tshirt-white.jpg', images: ['/images/basic-tshirt-white.jpg'], description: 'Classic white tee' },
    { slug: 'hoodie-grey', title: 'Hoodie - Grey', category: 'hoodies', heroImage: '/images/hoodie-grey.jpg', images: ['/images/hoodie-grey.jpg'], description: 'Cozy grey hoodie' },
    { slug: 'trouser-black', title: 'Trouser - Black', category: 'trouser', heroImage: '/images/trouser-black.jpg', images: ['/images/trouser-black.jpg'], description: 'Formal black trousers' },
  ];
}

async function initializeDatabase() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('90s-store');
    const products = db.collection('products');
    const sales = db.collection('sales');

    // Check if products collection is empty
    const productCount = await products.countDocuments();

    if (productCount === 0) {
      console.log('📦 Seeding initial products from manifest...');
      const manifestProducts = generateProducts();
      
      const productsToInsert = manifestProducts.map(mp => ({
        id: crypto.randomUUID(),
        slug: mp.slug,
        title: mp.title,
        description: mp.description || '',
        subCategory: mp.subCategory,
        productCode: mp.productCode || mp.slug.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 12),
        fabricDetails: mp.fabricDetails || DEFAULT_FABRIC_DETAILS,
        careInstructions: mp.careInstructions || DEFAULT_CARE_INSTRUCTIONS,
        category: mp.category,
        heroImage: mp.heroImage,
        images: mp.images,
        variants: [
          { 
            id: crypto.randomUUID(), 
            sku: `${mp.slug.toUpperCase()}-M`, 
            color: 'assorted', 
            size: 'M', 
            retailPriceBDT: basePrice[mp.category] || 1000 
          },
          { 
            id: crypto.randomUUID(), 
            sku: `${mp.slug.toUpperCase()}-L`, 
            color: 'assorted', 
            size: 'L', 
            retailPriceBDT: basePrice[mp.category] || 1000 
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      await products.insertMany(productsToInsert);
      console.log(`✅ Inserted ${productsToInsert.length} products`);

      // Create indexes
      await products.createIndex({ slug: 1 }, { unique: true });
      await products.createIndex({ category: 1 });
      await products.createIndex({ productCode: 1 });
      console.log('✅ Created indexes on products collection');
    } else {
      console.log(`ℹ️  Products collection already has ${productCount} documents`);
    }

    // Check if sales collection is empty
    const salesCount = await sales.countDocuments();

    if (salesCount === 0) {
      console.log('📊 Seeding initial sales data...');
      const salesToInsert = [];
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(Date.now() - (13 - i) * 86400000);
        const dateStr = date.toISOString().slice(0, 10);
        const orders = Math.floor(5 + Math.random() * 20);
        const revenue = Math.floor(40000 + Math.random() * 80000);

        salesToInsert.push({
          date: dateStr,
          orders,
          revenueBDT: revenue
        });
      }

      await sales.insertMany(salesToInsert);
      await sales.createIndex({ date: 1 }, { unique: true });
      console.log('✅ Inserted 14 days of sales data');
    } else {
      console.log(`ℹ️  Sales collection already has ${salesCount} documents`);
    }

    console.log('\n🎉 Database initialized successfully!');
    console.log('📝 Summary:');
    console.log(`   - Products: ${await products.countDocuments()}`);
    console.log(`   - Sales records: ${await sales.countDocuments()}`);
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

// Run initialization
initializeDatabase()
  .then(() => {
    console.log('✅ All done! You can now run: npm run dev');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
