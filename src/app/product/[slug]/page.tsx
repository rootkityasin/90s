import { getProductBySlug, generateWholesaleToken, listProducts } from '../../../lib/data/store';
import { notFound } from 'next/navigation';
import { JsonLd, productJsonLd } from '../../../lib/seo';
import ProductClient from './ProductClient';
import { ProductCard } from '../../components/ProductCard';

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
  const showPrice = !isWholesale;
  const all = listProducts();
  const sameCategory = all.filter(sp => sp.category === p.category && sp.slug !== p.slug);
  const otherCategories = all.filter(sp => sp.category !== p.category && sp.slug !== p.slug);
  const suggestions = [...sameCategory.slice(0, 4), ...otherCategories].slice(0, 4);
  return (
    <main className="container" data-no-footer>
      <JsonLd data={productJsonLd({ name: p.title, description: p.description, slug: p.slug, image: p.heroImage, price: variant.retailPriceBDT, currency: 'BDT' })} />
  <ProductClient product={p} isWholesale={isWholesale} />
      {suggestions.length > 0 && (
        <section style={{ marginTop:'2.2rem', marginBottom:'2.6rem' }}>
          <h2 className="header-accent" style={{ margin:'0 0 1rem', fontSize:'1.4rem' }}>You might also like</h2>
          <div className="grid">
            {suggestions.map(sp => (
              <ProductCard
                key={sp.id}
                p={sp}
                showPrice={showPrice}
                token={!showPrice ? generateWholesaleToken(sp.variants[0].sku) : undefined}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
