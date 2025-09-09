import { listProducts, listSales } from '../../lib/data/store';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default function Admin() {
  // Fetch data on the server to ensure deterministic HTML
  const rawProducts = listProducts();
  const sales = listSales();
  return <AdminClient productsInitial={rawProducts} sales={sales} />;
}
