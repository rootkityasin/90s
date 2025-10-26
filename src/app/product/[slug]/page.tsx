import { getProductByCode, generateClientToken, listProducts } from '../../../lib/data/store';
import { notFound } from 'next/navigation';
import { JsonLd, productJsonLd } from '../../../lib/seo';
import ProductClient from './ProductClient';
import { ProductCard } from '../../components/ProductCard';

// Note: This uses [slug] folder but treats it as productCode
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProductByCode(params.slug); // param is actually productCode
  if (!p) return {};
  return { title: p.title, description: p.description };
}

export default async function ProductPage({ params, searchParams }: { params: { slug: string }; searchParams: { mode?: string } }) {
  const p = await getProductByCode(params.slug); // param is actually productCode
  if (!p) return notFound();
  const isClientView = searchParams.mode === 'client';
  const variant = p.variants[0];
  const showPrice = !isClientView;
  const all = await listProducts();
  const sameCategory = all.filter(sp => sp.category === p.category && sp.productCode !== p.productCode);
  const otherCategories = all.filter(sp => sp.category !== p.category && sp.productCode !== p.productCode);
  const suggestions = [...sameCategory.slice(0, 4), ...otherCategories].slice(0, 4);
  return (
    <main className="container" data-no-footer>
      <JsonLd data={productJsonLd({ name: p.title, description: p.description, productCode: p.productCode, slug: p.slug, image: p.heroImage, price: variant.retailPriceBDT, currency: 'BDT' })} />
  <ProductClient product={p} isClient={isClientView} />
      {suggestions.length > 0 && (
        <section style={{ marginTop:'2.2rem', marginBottom:'2.6rem' }}>
          <h2 className="header-accent" style={{ margin:'0 0 1rem', fontSize:'1.4rem' }}>You might also like</h2>
          <div className="grid product-grid">
            {suggestions.map(sp => (
              <ProductCard
                key={sp.id}
                p={sp}
                showPrice={showPrice}
                token={!showPrice ? generateClientToken(sp.variants[0].sku) : undefined}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
