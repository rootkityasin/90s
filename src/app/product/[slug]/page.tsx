import { getProductBySlug, generateWholesaleToken } from '../../../lib/data/store';
import { notFound } from 'next/navigation';
import { JsonLd, productJsonLd } from '../../../lib/seo';

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
  const token = isWholesale ? generateWholesaleToken(variant.sku) : null;
  return (
    <main className="container">
      <JsonLd data={productJsonLd({ name: p.title, description: p.description, slug: p.slug, image: p.heroImage, price: variant.retailPriceBDT, currency: 'BDT' })} />
      <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
        <img src={p.heroImage} alt={p.title} style={{ width:360, maxWidth:'100%', borderRadius:16 }} />
        <div style={{ flex:1, minWidth:280 }}>
          <h1>{p.title}</h1>
          <p style={{ fontSize:'.85rem', lineHeight:1.4 }}>{p.description}</p>
          {isWholesale ? (
            <>
              <p style={{ fontSize:'.8rem' }}>Token (SKU): <strong>{token}</strong></p>
              <p style={{ marginTop:'.7rem', display:'flex', gap:'.6rem', flexWrap:'wrap' }}>
                <a href={`https://wa.me/${process.env.WHATSAPP_PHONE || '00000000000'}?text=Sample%20Token:%20${token}`} className="pill">WhatsApp</a>
                <a href={`https://www.facebook.com/messages/t/YourPage?ref=${token}`} className="pill" style={{ background:'#111' }}>Facebook</a>
                <a href={`https://www.instagram.com/`} className="pill" style={{ background:'#111' }}>Instagram</a>
              </p>
            </>
          ) : (
            <p style={{ fontWeight:600 }}>Price: ৳ {variant.retailPriceBDT}</p>
          )}
          {!isWholesale && (
            <div style={{ marginTop:'1rem', display:'flex', gap:'.6rem' }}>
              <button>Buy Online</button>
              <button className="secondary" style={{ background:'#111' }}>Cash on Delivery</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
