import { getProductByCode, generateClientToken, listProductsByBase } from '../../../../lib/data/store';
import { notFound } from 'next/navigation';
import { JsonLd, productJsonLd } from '../../../../lib/seo';
import ProductClient from '../../../product/[slug]/ProductClient';
import { ProductCard } from '../../../components/ProductCard';
import { enforceClientAccess } from '../../../../lib/auth/enforceClientAccess';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Note: params.slug is actually productCode now
  const p = await getProductByCode(params.slug);
  if (!p) return {};
  return { title: `${p.title} | Client`, description: p.description };
}

export default async function ClientProductPage({ params }: { params: { slug: string } }) {
  enforceClientAccess(`/client/product/${params.slug}`);
  // Note: params.slug is actually productCode now
  const p = await getProductByCode(params.slug);
  if (!p || p.base !== 'client') return notFound();
  const variant = p.variants[0];
  const all = await listProductsByBase('client');
  const sameCategory = all.filter(sp => sp.category === p.category && sp.productCode !== p.productCode);
  const otherCategories = all.filter(sp => sp.category !== p.category && sp.productCode !== p.productCode);
  const suggestions = [...sameCategory.slice(0, 4), ...otherCategories].slice(0, 4);

  return (
    <main className="container" data-no-footer>
      <JsonLd data={productJsonLd({ name: p.title, description: p.description, productCode: p.productCode, slug: p.slug, image: p.heroImage, price: variant.retailPriceBDT, currency: 'BDT' })} />
  <ProductClient product={p} isClient={true} />
      {suggestions.length > 0 && (
        <section style={{ marginTop: '2.2rem', marginBottom: '2.6rem' }}>
          <h2 className="header-accent" style={{ margin: '0 0 1rem', fontSize: '1.4rem' }}>You might also like</h2>
          <div className="grid product-grid">
            {suggestions.map(sp => (
              <ProductCard
                key={sp.id}
                p={sp}
                showPrice={false}
                token={generateClientToken(sp.variants[0].sku)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
