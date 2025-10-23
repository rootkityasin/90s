export type Variant = {
  id: string; // variant id
  sku: string;
  color: string;
  size: string;
  retailPriceBDT: number; // base price in BDT
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  fabricDetails?: string;
  careInstructions?: string;
  category: string;
  heroImage: string;
  // Additional gallery images (including heroImage as first element optionally)
  images?: string[]; // ordered list of image asset paths
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type SalesSnapshot = {
  date: string; // YYYY-MM-DD
  orders: number;
  revenueBDT: number;
};
