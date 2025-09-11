import { ProductsPage } from '../components';

export default function Client() {
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