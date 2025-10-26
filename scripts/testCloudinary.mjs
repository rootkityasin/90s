// Test Cloudinary configuration
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

config({ path: '.env.local' });

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
  console.log('🔍 Testing Cloudinary Configuration\n');
  console.log('═'.repeat(50));
  
  // Check environment variables
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  console.log('📝 Environment Variables:');
  console.log(`   Cloud Name: ${cloudName ? '✅ Set' : '❌ Missing'}`);
  console.log(`   API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`   API Secret: ${apiSecret ? '✅ Set' : '❌ Missing'}`);
  
  if (!cloudName || cloudName === 'your_cloud_name_here') {
    console.log('\n❌ Cloudinary not configured yet!');
    console.log('\n📝 To configure:');
    console.log('   1. Go to https://cloudinary.com/users/register_free');
    console.log('   2. Sign up for free account');
    console.log('   3. Get your credentials from dashboard');
    console.log('   4. Update .env.local with your values');
    console.log('   5. Run this test again');
    return;
  }
  
  console.log('\n🧪 Testing Connection...');
  
  try {
    // Test API connection by getting account details
    const result = await cloudinary.api.ping();
    console.log('   ✅ Connection successful!');
    console.log(`   Status: ${result.status}`);
    
    // Get usage stats
    const usage = await cloudinary.api.usage();
    console.log('\n📊 Account Usage:');
    console.log(`   Plan: ${usage.plan || 'Free'}`);
    console.log(`   Credits: ${usage.credits?.usage || 0} / ${usage.credits?.limit || 'N/A'}`);
    console.log(`   Storage: ${((usage.storage?.usage || 0) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Bandwidth: ${((usage.bandwidth?.usage || 0) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Transformations: ${usage.transformations?.usage || 0}`);
    
    console.log('\n✨ Cloudinary is ready to use!');
    console.log('   Images will be uploaded to: 90s-store/products/');
    console.log('   Automatic optimization: enabled');
    console.log('   Max image size: 1200x1200px');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('   Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Check your credentials are correct');
    console.log('   - Verify account is active');
    console.log('   - Check internet connection');
  }
  
  console.log('\n' + '═'.repeat(50));
}

testCloudinary();
