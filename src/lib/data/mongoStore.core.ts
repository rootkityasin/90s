// MongoDB Atlas store with 512MB free tier (permanent)
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import {
  Product,
  ProductInput,
  SalesSnapshot,
  ClientTokenRecord,
  ClientTokenContact,
  ClientTokenSnapshot
} from '../types';
import { generateProductsFromManifest } from './productManifest';
import { ensureProfessionalDescription, ensureProfessionalFabricDetails, polishProductCopy } from '../formatProductCopy';

import 'server-only';
// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/90s-store';

type ClientTokenDoc = ClientTokenRecord & { _id?: ObjectId };

type CreateClientTokenParams = {
  sku: string;
  productId?: string;
  productCode?: string;
  variantId?: string;
  quantity: number;
  color: string;
  size: string;
  client: ClientTokenContact;
  productSnapshot?: ClientTokenSnapshot;
};

function trimString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function trimOptional(value: unknown): string | undefined {
  const trimmed = trimString(value);
  return trimmed ? trimmed : undefined;
}

function normalizeContact(raw?: Partial<ClientTokenContact>): ClientTokenContact {
  return {
    name: trimString(raw?.name),
    email: trimString(raw?.email),
    phone: trimString(raw?.phone),
    company: trimOptional(raw?.company),
    address: trimString(raw?.address),
    notes: trimOptional(raw?.notes)
  };
}

function normalizeSnapshot(raw?: Partial<ClientTokenSnapshot>): ClientTokenSnapshot | undefined {
  if (!raw) return undefined;
  const snapshot: ClientTokenSnapshot = {
    productTitle: trimOptional(raw.productTitle),
    heroImage: trimOptional(raw.heroImage),
    productSlug: trimOptional(raw.productSlug),
    productCode: trimOptional(raw.productCode)
  };
  return Object.values(snapshot).some(Boolean) ? snapshot : undefined;
}

function composeTokenBase(sku: string, color: string, size: string, quantity: number): string {
  const normalizedColor = color.replace(/\s+/g, '-').toLowerCase();
  const normalizedSize = size.replace(/\s+/g, '-').toUpperCase();
  return `${sku}:${normalizedColor}:${normalizedSize}:${quantity}`;
}

function createTokenWithSuffix(base: string): string {
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `${base}#${suffix}`;
}
let client: MongoClient | null = null;
let db: Db | null = null;

// Price heuristics by category
const basePrice: Record<string, number> = { 
  cargos: 2200, 
  chinos: 2000, 
  tshirt: 950, 
  hoodies: 2600, 
  trouser: 2400 
};

const DEFAULT_FABRIC_DETAILS = 'Fabric: 95% cotton and 5% elastane for natural stretch. Pre-laundered for a soft, broken-in hand feel. Colorfast finishing preserves the tone wear after wear.';
const DEFAULT_CARE_INSTRUCTIONS = 'Care: Machine wash cold inside out with like colours. Do not bleach. Tumble dry low or line dry. Warm iron on reverse if needed.';

// Connect to MongoDB
async function connectDB(): Promise<Db> {
  if (db) return db;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('90s-store');
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Get collections
async function getCollections() {
  const database = await connectDB();
  return {
    products: database.collection<Product>('products'),
    sales: database.collection<SalesSnapshot>('sales'),
    clientTokens: database.collection<ClientTokenDoc>('clientTokens')
  };
}

// Initialize database with seed data
export async function initializeDatabase() {
  try {
    const { products, sales, clientTokens } = await getCollections();

    // Check if products collection is empty
    const productCount = await products.countDocuments();

    if (productCount === 0) {
      console.log('Seeding initial products from manifest...');
      const manifestProducts = generateProductsFromManifest();
      
      const productsToInsert = manifestProducts.map((mp) => polishProductCopy({
        id: crypto.randomUUID(),
        slug: mp.slug,
        title: mp.title,
        description: mp.description || '',
        subCategory: mp.subCategory,
        productCode: mp.productCode || mp.slug.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 12),
        fabricDetails: mp.fabricDetails || DEFAULT_FABRIC_DETAILS,
        careInstructions: mp.careInstructions || DEFAULT_CARE_INSTRUCTIONS,
        category: mp.category,
        base: 'retail' as const,
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

      await products.insertMany(productsToInsert as any);
      console.log(`✅ Inserted ${productsToInsert.length} products`);

      // Create indexes
      await products.createIndex({ slug: 1 }, { unique: true });
      await products.createIndex({ category: 1 });
      await products.createIndex({ productCode: 1 });
      await products.createIndex({ base: 1 });
      console.log('✅ Created indexes');
    }

    // Check if sales collection is empty
    const salesCount = await sales.countDocuments();

    if (salesCount === 0) {
      console.log('Seeding initial sales data...');
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
      console.log('✅ Inserted sales data');
    }

    try {
      await clientTokens.createIndex({ token: 1 }, { unique: true, name: 'client_token_unique' });
      await clientTokens.createIndex({ sku: 1 }, { name: 'client_token_sku_idx' });
    } catch (indexError) {
      console.warn('Client token index setup warning:', indexError);
    }

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// List all products
export async function listProducts(): Promise<Product[]> {
  try {
    const { products } = await getCollections();
    const list = await products.find({}).sort({ createdAt: -1 }).toArray();
    return list.map(polishProductCopy);
  } catch (error) {
    console.error('Error listing products:', error);
    return [];
  }
}

// List products by base (retail or client)
export async function listProductsByBase(base: 'retail' | 'client'): Promise<Product[]> {
  try {
    const { products } = await getCollections();
    const list = await products.find({ base }).sort({ createdAt: -1 }).toArray();
    return list.map(polishProductCopy);
  } catch (error) {
    console.error(`Error listing ${base} products:`, error);
    return [];
  }
}

// Get product by slug
// Get product by product code (PRIMARY METHOD)
export async function getProductByCode(productCode: string): Promise<Product | null> {
  try {
    const { products } = await getCollections();
    const product = await products.findOne({ productCode });
    return product ? polishProductCopy(product) : null;
  } catch (error) {
    console.error('Error getting product by code:', error);
    return null;
  }
}

// Get product by ID (internal use only)
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { products } = await getCollections();
    const product = await products.findOne({ id });
    return product ? polishProductCopy(product) : null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    return null;
  }
}

// Add new product
export async function addProduct(input: ProductInput): Promise<Product> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  const normalizedSubCategory = input.subCategory?.trim() || undefined;
  const normalizedProductCode = input.productCode?.trim() || 
    input.slug.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 12);

  const baseProduct: Product = {
    id,
    createdAt: now,
    updatedAt: now,
    ...input,
    description: ensureProfessionalDescription(input.title, input.category, input.description),
    subCategory: normalizedSubCategory,
    productCode: normalizedProductCode,
    fabricDetails: ensureProfessionalFabricDetails(input.fabricDetails?.trim() || DEFAULT_FABRIC_DETAILS),
    careInstructions: input.careInstructions?.trim() || DEFAULT_CARE_INSTRUCTIONS
  };

  try {
    const { products } = await getCollections();
    const product = polishProductCopy(baseProduct);
    await products.insertOne(product as any);
    return product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

// Update product by productCode
export async function updateProduct(productCode: string, patch: Partial<ProductInput>): Promise<Product | null> {
  try {
    // Find by productCode only
    const existing = await getProductByCode(productCode);
    if (!existing) return null;

    const normalizedSubCategory = patch.subCategory !== undefined
      ? (patch.subCategory?.trim() || undefined)
      : existing.subCategory;
    
    const normalizedProductCode = patch.productCode !== undefined
      ? (patch.productCode?.trim() || undefined)
      : existing.productCode;

  const nextTitle = typeof patch.title === 'string' ? patch.title : existing.title;
  const nextCategory = typeof patch.category === 'string' ? patch.category : existing.category;

  const updates: any = { ...patch };
    
    if (patch.subCategory !== undefined) {
      updates.subCategory = normalizedSubCategory;
    }
    if (patch.productCode !== undefined) {
      updates.productCode = normalizedProductCode;
    }
    if (patch.description !== undefined) {
      updates.description = ensureProfessionalDescription(nextTitle, nextCategory, patch.description as string | null);
    }
    if (patch.fabricDetails !== undefined) {
      updates.fabricDetails = ensureProfessionalFabricDetails((patch.fabricDetails as string | null) || DEFAULT_FABRIC_DETAILS);
    }
    if (patch.careInstructions !== undefined) {
      updates.careInstructions = patch.careInstructions?.trim() || DEFAULT_CARE_INSTRUCTIONS;
    }

    updates.updatedAt = new Date().toISOString();

    const { products } = await getCollections();
    // Update by id (the actual unique identifier)
    await products.updateOne({ id: existing.id }, { $set: updates });

    return await getProductById(existing.id);
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

// Delete product by productCode
export async function deleteProduct(productCode: string): Promise<boolean> {
  try {
    // Find by productCode only
    const existing = await getProductByCode(productCode);
    if (!existing) return false;

    const { products } = await getCollections();
    const result = await products.deleteOne({ id: existing.id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// List sales
export async function listSales(): Promise<SalesSnapshot[]> {
  try {
    const { sales } = await getCollections();
    return await sales.find({}).sort({ date: 1 }).toArray();
  } catch (error) {
    console.error('Error listing sales:', error);
    return [];
  }
}

// Get product by SKU
export async function getProductBySKU(sku: string): Promise<Product | null> {
  try {
    const { products } = await getCollections();
    const product = await products.findOne({ 'variants.sku': sku });
    return product ? polishProductCopy(product) : null;
  } catch (error) {
    console.error('Error getting product by SKU:', error);
    return null;
  }
}

export async function createClientTokenRecord(params: CreateClientTokenParams): Promise<ClientTokenRecord> {
  const sku = trimString(params.sku);
  const quantity = Number.isFinite(params.quantity) ? Number(params.quantity) : 0;
  if (!sku) {
    throw new Error('SKU is required to create a client token');
  }
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than zero');
  }

  const client = normalizeContact(params.client);
  if (!client.name || !client.email || !client.phone || !client.address) {
    throw new Error('Client name, email, phone, and address are required');
  }

  const color = trimString(params.color) || 'unspecified';
  const size = trimString(params.size) || 'unsized';
  const base = composeTokenBase(sku, color, size, quantity);
  const productSnapshot = normalizeSnapshot(params.productSnapshot);

  const { clientTokens } = await getCollections();
  const now = new Date().toISOString();

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const token = createTokenWithSuffix(base);
    const record: ClientTokenRecord = {
      token,
      sku,
      productId: trimOptional(params.productId),
      productCode: trimOptional(params.productCode),
      variantId: trimOptional(params.variantId),
      quantity,
      color,
      size,
      client,
      productSnapshot,
      createdAt: now,
      updatedAt: now
    };

    try {
      await clientTokens.insertOne(record as ClientTokenDoc);
      return record;
    } catch (error: any) {
      if (error?.code === 11000) {
        continue;
      }
      console.error('Error storing client token:', error);
      throw error;
    }
  }

  throw new Error('Unable to allocate a unique token');
}

export async function getClientTokenRecord(token: string): Promise<ClientTokenRecord | null> {
  const safeToken = trimString(token);
  if (!safeToken) return null;
  try {
    const { clientTokens } = await getCollections();
    const doc = await clientTokens.findOne({ token: safeToken });
    if (!doc) return null;
    const { _id, ...record } = doc;
    const updatedAt = new Date().toISOString();
    await clientTokens.updateOne({ token: safeToken }, { $set: { updatedAt } });
    return { ...record, updatedAt };
  } catch (error) {
    console.error('Error reading client token record:', error);
    return null;
  }
}

// Re-export client utilities
export { generateClientToken, findUserByEmail, allDemoUsers, type DemoUser } from './clientUtils';
