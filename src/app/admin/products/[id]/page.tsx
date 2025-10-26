import { listProducts } from '../../../../lib/data/store';
import FullEditForm from '../../components/FullEditForm';

export default async function FullEditPage({ params }: { params: { id: string } }) {
  const products = await listProducts();
  const product = products.find(p => p.id === params.id);
  if (!product) return <main className="container"><p>Product not found.</p></main>;
  return (
    <main className="container">
      <h1>Edit Product</h1>
      <FullEditForm product={product} />
    </main>
  );
}
