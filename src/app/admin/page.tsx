import { listProducts, listSales } from '../../lib/data/store';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  const rawProducts = await listProducts();
  const sales = await listSales();
  return <div data-no-footer><AdminClient productsInitial={rawProducts} sales={sales} /></div>;
}
