import { listProducts } from '../../lib/data/store';
import { ProductCard } from '../components/ProductCard';
import { FadeUpDiv, Stagger } from '../components/animations';

export const dynamic = 'force-dynamic';

export default function Retail() {
  const products = listProducts();
  return (
    <main className="container">
      <FadeUpDiv index={0}><h1 className="header-accent">Save Money, Look Great</h1></FadeUpDiv>
      <FadeUpDiv index={1}><p style={{ maxWidth:640, fontSize:'.85rem' }}>Retail storefront (prices visible). Online & COD purchasing placeholders included.</p></FadeUpDiv>
      <Stagger>
        <div className="grid" style={{ marginTop:'1.2rem' }}>
          {products.map(p => <ProductCard key={p.id} p={p} showPrice />)}
        </div>
      </Stagger>
    </main>
  );
}