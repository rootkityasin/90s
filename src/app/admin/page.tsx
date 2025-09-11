import { listProducts, listSales } from '../../lib/data/store';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default function Admin() {
  const rawProducts = listProducts();
  const sales = listSales();
  return <div data-no-footer><AdminClient productsInitial={rawProducts} sales={sales} /></div>;
}
