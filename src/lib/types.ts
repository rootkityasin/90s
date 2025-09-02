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
  category: string;
  heroImage: string;
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
