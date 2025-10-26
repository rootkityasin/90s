// Simple MongoDB connection test
import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

console.log('Testing MongoDB connection...');
console.log('URI:', uri?.replace(/hDDwMke0mKFjT32A/, '****'));

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('90s-store');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();
