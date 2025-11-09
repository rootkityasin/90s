import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const envPath = ['.env.local', '.env'].map((name) => resolve(process.cwd(), name)).find((file) => existsSync(file));
if (envPath) {
  loadEnv({ path: envPath });
} else {
  loadEnv();
}
import { MongoClient } from 'mongodb';
import { ensureProfessionalDescription, ensureProfessionalFabricDetails } from '../src/lib/formatProductCopy';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Please set it in your environment.');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('90s-store');
  const products = db.collection('products');

  const docs = await products.find({}).toArray();
  console.log(`Found ${docs.length} products.`);

  const preview = docs.slice(0, 5).map((doc) => ({
    title: doc.title,
    descriptionBefore: doc.description,
    descriptionAfter: ensureProfessionalDescription(doc.title, doc.category, doc.description),
    fabricBefore: doc.fabricDetails,
    fabricAfter: ensureProfessionalFabricDetails(doc.fabricDetails),
  }));

  console.log('Preview (first 5 products):');
  console.dir(preview, { depth: null });

  const updates = docs
    .map((doc) => {
      const description = ensureProfessionalDescription(doc.title, doc.category, doc.description);
      const fabricDetails = ensureProfessionalFabricDetails(doc.fabricDetails);
      const needsUpdate = description !== doc.description || fabricDetails !== doc.fabricDetails;

      if (!needsUpdate) return null;

      return {
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: {
              description,
              fabricDetails,
            },
          },
        },
      };
    })
    .filter((op): op is NonNullable<typeof op> => Boolean(op));

  if (updates.length === 0) {
    console.log('No updates needed.');
    await client.close();
    return;
  }

  const result = await products.bulkWrite(updates, { ordered: false });
  console.log(`Updated ${result.modifiedCount} products.`);
  await client.close();
}

main().catch((error) => {
  console.error('Failed to polish product descriptions:', error);
  process.exit(1);
});
