import { listProducts, generateWholesaleToken } from '../../lib/data/store';
import { ProductCard } from '../components/ProductCard';

export const dynamic = 'force-dynamic';

export default function Wholesale() {
  const products = listProducts();
  return (
    <main className="container">
      <h1 style={{ fontFamily:'var(--font-display)', letterSpacing:'1px' }}>90's Wholesale</h1>
      <p style={{ maxWidth:640, fontSize:'.8rem' }}>Prices hidden. Each card shows a token that a buyer can send via social media to start a contract conversation.</p>
      <div className="grid">
        {products.map(p => {
          const sku = p.variants[0].sku;
          const token = generateWholesaleToken(sku);
          return <ProductCard key={p.id} p={p} showPrice={false} token={token} />;
        })}
      </div>
    </main>
  );
}
