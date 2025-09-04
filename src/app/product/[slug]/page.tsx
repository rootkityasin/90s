import { getProductBySlug, generateWholesaleToken } from '../../../lib/data/store';
import { notFound } from 'next/navigation';
import { JsonLd, productJsonLd } from '../../../lib/seo';
import ProductClient from './ProductClient';

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProductBySlug(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.description };
}

export default function ProductPage({ params, searchParams }: { params: { slug: string }; searchParams: { mode?: string } }) {
  const p = getProductBySlug(params.slug);
  if (!p) return notFound();
  const isWholesale = searchParams.mode === 'client';
  const variant = p.variants[0];
  return (
    <main className="container">
      <JsonLd data={productJsonLd({ name: p.title, description: p.description, slug: p.slug, image: p.heroImage, price: variant.retailPriceBDT, currency: 'BDT' })} />
  <ProductClient product={p} isWholesale={isWholesale} />
    </main>
  );
}
