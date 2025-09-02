import { listProducts, generateWholesaleToken } from '../../lib/data/store';
import { ProductCard } from '../components/ProductCard';
import { FadeUpDiv, Stagger } from '../components/animations';

export const dynamic = 'force-dynamic';

export default function Client() {
  const products = listProducts();
  return (
    <main className="container">
      <FadeUpDiv index={0}><h1 className="header-accent">Client Samples</h1></FadeUpDiv>
      <FadeUpDiv index={1}><p style={{ maxWidth:640, fontSize:'.8rem' }}>Prices hidden. Token equals SKU. Use WhatsApp first to reference the token and discuss contract.</p></FadeUpDiv>
      <Stagger>
        <div className="grid" style={{ marginTop:'1.2rem' }}>
          {products.map(p => <ProductCard key={p.id} p={p} showPrice={false} token={generateWholesaleToken(p.variants[0].sku)} />)}
        </div>
      </Stagger>
    </main>
  );
}