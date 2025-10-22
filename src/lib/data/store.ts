// Simple in-memory store for demo purposes. Replace with DB later.
// Because this runs in a single server process, data resets on restart.
import { Product, ProductInput, SalesSnapshot } from '../types';
import { generateProductsFromManifest } from './productManifest';
// random uuid helper (no node types assumption)
const randomUUID = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? () => (crypto as any).randomUUID() : () => 'id-' + Math.random().toString(36).slice(2,11);

// Generate base data from manifest (all images become products unless manually grouped)
const manifestProducts = generateProductsFromManifest();

// Basic price heuristics by category
const basePrice: Record<string, number> = { cargos: 2200, chinos: 2000, tshirt: 950, hoodies: 2600, trouser: 2400 };

let products: Product[] = manifestProducts.map(mp => ({
  id: randomUUID(),
  slug: mp.slug,
  title: mp.title,
  description: `${mp.title} (${mp.category}).`,
  category: mp.category,
  heroImage: mp.heroImage,
  images: mp.images,
  variants: [
    { id: randomUUID(), sku: `${mp.slug.toUpperCase()}-M`, color: 'assorted', size: 'M', retailPriceBDT: basePrice[mp.category] || 1000 },
    { id: randomUUID(), sku: `${mp.slug.toUpperCase()}-L`, color: 'assorted', size: 'L', retailPriceBDT: basePrice[mp.category] || 1000 }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

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

export function addProduct(input: ProductInput) {
  const now = new Date().toISOString();
  const p: Product = { id: randomUUID(), createdAt: now, updatedAt: now, ...input };
  products.unshift(p);
  return p;
}

export function updateProduct(id: string, patch: Partial<ProductInput>) {
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...patch, updatedAt: new Date().toISOString() };
  return products[idx];
}

export function deleteProduct(id: string): boolean {
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  return products.length < initialLength;
}

export function listSales() {
  return sales;
}

// Client token: simple reversible format for demo (SKU only for now)
export function generateClientToken(sku: string) { return sku; }

// Simple demo users & roles (retail customer, client, admin)
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
