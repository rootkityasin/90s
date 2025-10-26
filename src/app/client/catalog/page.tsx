import { ProductsPage } from '../../components';
import { enforceClientAccess } from '../../../lib/auth/enforceClientAccess';
import { listProducts } from '../../../lib/data/store';

export const dynamic = 'force-dynamic';

export default async function ClientCatalog() {
  enforceClientAccess('/client/catalog');
  const products = await listProducts();
  return (
    <div data-no-footer>
      <ProductsPage
        title="Client Samples"
        description="Prices hidden. Token equals SKU. Use WhatsApp first to reference the token and discuss contract."
        mode="client"
        productsInitial={products}
      />
    </div>
  );
}
