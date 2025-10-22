import { redirect } from 'next/navigation';

export const metadata = { title: 'Client Catalog Redirect' };

export default function DeprecatedWholesalePage() {
  redirect('/client/catalog');
}
