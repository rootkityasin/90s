import { ProductsPage } from '../components';
import { listProductsByBase } from '../../lib/data/store';

export const dynamic = 'force-dynamic';

export default async function Retail() {
  const products = await listProductsByBase('retail');
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