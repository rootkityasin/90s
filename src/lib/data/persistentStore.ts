// Persistent file-based store for products
import { Product, ProductInput, SalesSnapshot } from '../types';
import { generateProductsFromManifest } from './productManifest';
import { ensureProfessionalDescription, ensureProfessionalFabricDetails, polishProductCopy } from '../formatProductCopy';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const randomUUID = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? () => (crypto as any).randomUUID() : () => 'id-' + Math.random().toString(36).slice(2,11);

const DATA_DIR = join(process.cwd(), 'data');
const PRODUCTS_FILE = join(DATA_DIR, 'products.json');

const DEFAULT_FABRIC_DETAILS = 'Fabric: 95% cotton and 5% elastane for natural stretch. Pre-laundered for a soft, broken-in hand feel. Colorfast finishing preserves the tone wear after wear.';
const DEFAULT_CARE_INSTRUCTIONS = 'Care: Machine wash cold inside out with like colours. Do not bleach. Tumble dry low or line dry. Warm iron on reverse if needed.';

// Basic price heuristics by category
const basePrice: Record<string, number> = { cargos: 2200, chinos: 2000, tshirt: 950, hoodies: 2600, trouser: 2400 };

// Initialize storage directory
function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load products from file or generate from manifest
function loadProducts(): Product[] {
  ensureDataDir();
  
  if (existsSync(PRODUCTS_FILE)) {
    try {
      const data = readFileSync(PRODUCTS_FILE, 'utf-8');
  const parsed: Product[] = JSON.parse(data);
  const polished = parsed.map(polishProductCopy);
  saveProducts(polished);
  return polished;
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }
  
  // Generate initial products from manifest
  const manifestProducts = generateProductsFromManifest();
  const products = manifestProducts.map((mp) => polishProductCopy({
    id: randomUUID(),
    slug: mp.slug,
    title: mp.title,
    description: mp.description || '',
    subCategory: mp.subCategory,
    productCode: mp.productCode || mp.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,12),
    fabricDetails: mp.fabricDetails || DEFAULT_FABRIC_DETAILS,
    careInstructions: mp.careInstructions || DEFAULT_CARE_INSTRUCTIONS,
    category: mp.category,
    base: 'retail' as const,
    heroImage: mp.heroImage,
    images: mp.images,
    variants: [
      { id: randomUUID(), sku: `${mp.slug.toUpperCase()}-M`, color: 'assorted', size: 'M', retailPriceBDT: basePrice[mp.category] || 1000 },
      { id: randomUUID(), sku: `${mp.slug.toUpperCase()}-L`, color: 'assorted', size: 'L', retailPriceBDT: basePrice[mp.category] || 1000 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  saveProducts(products);
  return products;
}

// Save products to file
function saveProducts(products: Product[]) {
  ensureDataDir();
  try {
    writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

let products: Product[] = loadProducts();

let sales: SalesSnapshot[] = Array.from({ length: 14 }).map((_, i) => {
  const date = new Date(Date.now() - (13 - i) * 86400000);
  return {
    date: date.toISOString().slice(0, 10),
    orders: Math.floor(5 + Math.random() * 20),
    revenueBDT: Math.floor(40000 + Math.random() * 80000)
  };
});

export function listProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find(p => p.slug === slug) || null;
}

export function getProductById(id: string) {
  return products.find(p => p.id === id) || null;
}

export function addProduct(input: ProductInput) {
  const now = new Date().toISOString();
  const normalizedSubCategory = input.subCategory && input.subCategory.trim() ? input.subCategory.trim() : undefined;
  const normalizedProductCode = input.productCode && input.productCode.trim()
    ? input.productCode.trim()
    : input.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,12);
  const baseProduct: Product = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...input,
    description: ensureProfessionalDescription(input.title, input.category, input.description),
    subCategory: normalizedSubCategory,
    productCode: normalizedProductCode,
    fabricDetails: ensureProfessionalFabricDetails(input.fabricDetails && input.fabricDetails.trim() ? input.fabricDetails : DEFAULT_FABRIC_DETAILS),
    careInstructions: input.careInstructions && input.careInstructions.trim() ? input.careInstructions : DEFAULT_CARE_INSTRUCTIONS
  };
  const product = polishProductCopy(baseProduct);
  products.unshift(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id: string, patch: Partial<ProductInput>) {
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  
  const current = products[idx];
  const normalizedSubCategory = patch.subCategory !== undefined
    ? (patch.subCategory && patch.subCategory.trim() ? patch.subCategory.trim() : undefined)
    : current.subCategory;
  const normalizedProductCode = patch.productCode !== undefined
    ? (patch.productCode && patch.productCode.trim()
        ? patch.productCode.trim()
        : current.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,12))
    : current.productCode || current.slug.toUpperCase().replace(/[^A-Z0-9]+/g,'').slice(0,12);
  
  const nextTitle = typeof patch.title === 'string' ? patch.title : current.title;
  const nextCategory = typeof patch.category === 'string' ? patch.category : current.category;

  products[idx] = polishProductCopy({
    ...current,
    ...patch,
    id: current.id, // Never change ID
    subCategory: normalizedSubCategory,
    productCode: normalizedProductCode,
    description: patch.description !== undefined
      ? ensureProfessionalDescription(nextTitle, nextCategory, patch.description as string | null)
      : current.description,
    fabricDetails: patch.fabricDetails !== undefined
      ? ensureProfessionalFabricDetails(patch.fabricDetails && (patch.fabricDetails as string).trim() ? patch.fabricDetails : DEFAULT_FABRIC_DETAILS)
      : current.fabricDetails,
    careInstructions: patch.careInstructions !== undefined
      ? (patch.careInstructions && patch.careInstructions.trim() ? patch.careInstructions : DEFAULT_CARE_INSTRUCTIONS)
      : current.careInstructions,
    updatedAt: new Date().toISOString()
  });
  
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  const deleted = products.length < initialLength;
  if (deleted) {
    saveProducts(products);
  }
  return deleted;
}

export function listSales() {
  return sales;
}

export function generateClientToken(sku: string) { return sku; }

export type DemoUser = { id: string; email: string; role: 'retail' | 'client' | 'admin' };
const demoUserList: DemoUser[] = [
  { id: 'u1', email: 'retail@example.com', role: 'retail' },
  { id: 'u2', email: 'client@example.com', role: 'client' },
  { id: 'u3', email: 'admin@example.com', role: 'admin' }
];
export function findUserByEmail(email: string) { return demoUserList.find(u => u.email === email) || null; }
export function allDemoUsers() { return demoUserList; }
export function getProductBySKU(sku: string) {
  for (const product of products) {
    if (product.variants.some(v => v.sku === sku)) {
      return product;
    }
  }
  return null;
}
