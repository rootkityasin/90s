import { ProductsPage } from '../../components';
import { enforceClientAccess } from '../../../lib/auth/enforceClientAccess';

export default function ClientCatalog() {
  enforceClientAccess('/client/catalog');
  return (
    <div data-no-footer>
      <ProductsPage
        title="Client Samples"
        description="Prices hidden. Token equals SKU. Use WhatsApp first to reference the token and discuss contract."
        mode="client"
      />
    </div>
  );
}
