import { ProductsPage } from '../components';
import { listProducts } from '../../lib/data/store';

export const dynamic = 'force-dynamic';

export default async function Retail() {
  const products = await listProducts();
  return (
    <div data-no-footer>
      <ProductsPage
        title="Save Money, Look Great"
        description="Retail storefront (prices visible). Online & COD purchasing placeholders included."
        mode="retail"
        productsInitial={products}
      />
    </div>
  );
}