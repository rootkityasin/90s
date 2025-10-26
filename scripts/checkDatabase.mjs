// Check existing data and initialize if needed
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

const sampleProducts = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    slug: "classic-white-tshirt",
    category: "T-Shirts",
    price: 29.99,
    stock: 100,
    image: "/images/white-tshirt.jpg",
    description: "Premium cotton t-shirt with a comfortable fit.",
    productCode: "WST-001",
  },
  {
    id: "2",
    name: "Blue Denim Jeans",
    slug: "blue-denim-jeans",
    category: "Jeans",
    price: 79.99,
    stock: 50,
    image: "/images/blue-jeans.jpg",
    description: "Classic fit denim jeans made from durable fabric.",
    productCode: "BDJ-002",
  },
  {
    id: "3",
    name: "Black Hoodie",
    slug: "black-hoodie",
    category: "Hoodies",
    price: 59.99,
    stock: 75,
    image: "/images/black-hoodie.jpg",
    description: "Warm and stylish hoodie perfect for casual wear.",
    productCode: "BHD-003",
  },
  {
    id: "4",
    name: "Red Sneakers",
    slug: "red-sneakers",
    category: "Shoes",
    price: 89.99,
    stock: 30,
    image: "/images/red-sneakers.jpg",
    description: "Comfortable sneakers with modern design.",
    productCode: "RSN-004",
  },
  {
    id: "5",
    name: "Summer Dress",
    slug: "summer-dress",
    category: "Dresses",
    price: 49.99,
    stock: 40,
    image: "/images/summer-dress.jpg",
    description: "Light and breezy dress for summer days.",
    productCode: "SDR-005",
  }
];

async function checkAndSeedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('90s-store');
    const productsCol = db.collection('products');
    const salesCol = db.collection('sales');
    
    // Check existing data
    const productCount = await productsCol.countDocuments();
    const salesCount = await salesCol.countDocuments();
    
    console.log(`\n📊 Current Data:`);
    console.log(`  Products: ${productCount}`);
    console.log(`  Sales: ${salesCount}`);
    
    if (productCount === 0) {
      console.log('\n🌱 Seeding products...');
      await productsCol.insertMany(sampleProducts);
      
      // Create indexes
      await productsCol.createIndex({ slug: 1 }, { unique: true });
      await productsCol.createIndex({ category: 1 });
      await productsCol.createIndex({ productCode: 1 }, { unique: true });
      
      console.log('✅ Products seeded successfully');
    } else {
      console.log('✅ Products already exist');
    }
    
    if (salesCount === 0) {
      console.log('\n🌱 Seeding sales data...');
      const salesData = [];
      const endDate = new Date();
      
      for (let i = 0; i < 14; i++) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        
        sampleProducts.forEach((product) => {
          const sales = Math.floor(Math.random() * 20) + 5;
          salesData.push({
            productId: product.id,
            productName: product.name,
            date: date.toISOString().split('T')[0],
            sales: sales,
            revenue: sales * product.price,
          });
        });
      }
      
      await salesCol.insertMany(salesData);
      await salesCol.createIndex({ date: -1 });
      await salesCol.createIndex({ productId: 1 });
      
      console.log('✅ Sales data seeded successfully');
    } else {
      console.log('✅ Sales data already exists');
    }
    
    // Show summary
    const finalProductCount = await productsCol.countDocuments();
    const finalSalesCount = await salesCol.countDocuments();
    
    console.log(`\n✨ Database Ready!`);
    console.log(`  Total Products: ${finalProductCount}`);
    console.log(`  Total Sales Records: ${finalSalesCount}`);
    
    // List products
    console.log('\n📦 Products:');
    const products = await productsCol.find({}).toArray();
    products.forEach(p => {
      console.log(`  - ${p.name} (${p.productCode}) - $${p.price} - Stock: ${p.stock}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Connection closed');
  }
}

checkAndSeedDatabase();
