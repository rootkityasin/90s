// Simple in-memory store for demo purposes. Replace with DB later.
// Because this runs in a single server process, data resets on restart.
import { Product, ProductInput, SalesSnapshot } from '../types';
// random uuid helper (no node types assumption)
const randomUUID = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? () => (crypto as any).randomUUID() : () => 'id-' + Math.random().toString(36).slice(2,11);

let products: Product[] = [
  {
    id: randomUUID(),
    slug: 'retro-teal-shirt',
    title: "Retro Teal Shirt",
    description: "Breathable cotton blend shirt with a 90's teal vibe.",
    category: 'shirt',
    heroImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    variants: [
      { id: randomUUID(), sku: 'RTS-TEAL-M', color: 'teal', size: 'M', retailPriceBDT: 1800 },
      { id: randomUUID(), sku: 'RTS-TEAL-L', color: 'teal', size: 'L', retailPriceBDT: 1800 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: randomUUID(),
    slug: 'magenta-hoodie',
    title: 'Magenta Hoodie',
    description: "Soft fleece hoodie with bold magenta tone.",
    category: 'hoodie',
    heroImage: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=800',
    variants: [
      { id: randomUUID(), sku: 'MHO-MAG-S', color: 'magenta', size: 'S', retailPriceBDT: 2600 },
      { id: randomUUID(), sku: 'MHO-MAG-M', color: 'magenta', size: 'M', retailPriceBDT: 2600 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

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

export function listSales() {
  return sales;
}

// Wholesale token: simple reversible format for demo (SKU + day + random)
export function generateWholesaleToken(sku: string) { return sku; }

// Simple demo users & roles (retail customer, client wholesale, admin)
export type DemoUser = { id: string; email: string; role: 'retail' | 'client' | 'admin' };
const demoUserList: DemoUser[] = [
  { id: 'u1', email: 'retail@example.com', role: 'retail' },
  { id: 'u2', email: 'client@example.com', role: 'client' },
  { id: 'u3', email: 'admin@example.com', role: 'admin' }
];
export function findUserByEmail(email: string) { return demoUserList.find(u => u.email === email) || null; }
export function allDemoUsers() { return demoUserList; }
