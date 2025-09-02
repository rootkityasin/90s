import { listProducts, listSales } from '../../lib/data/store';
import { createProduct, editProduct } from './actions';
import { Suspense } from 'react';
import AdminAnimatedGrid from './parts/AdminAnimatedGrid';

export const dynamic = 'force-dynamic';

function TinyLine({ points }: { points: number[] }) {
  const w = 140; const h = 40;
  const max = Math.max(...points);
  const path = points.map((p,i) => `${(i/(points.length-1))*w},${h - (p/max)*h}`).join(' ');
  return <svg width={w} height={h} style={{ overflow:'visible' }}><polyline fill="none" stroke="var(--color-accent)" strokeWidth={2} points={path} /></svg>;
}

export default function Admin() {
  const products = listProducts();
  const sales = listSales();
  const revenueSeries = sales.map(s => s.revenueBDT);
  const recent = revenueSeries.slice(-8);
  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <section style={{ display:'flex', flexWrap:'wrap', gap:'2rem' }}>
        <div>
          <h3 style={{ margin:'0 0 .3rem' }}>Revenue (last {recent.length} days)</h3>
          <TinyLine points={recent} />
        </div>
        <div>
          <h3 style={{ margin:'0 0 .3rem' }}>Products</h3>
          <p style={{ fontSize:'.8rem' }}>{products.length} products live</p>
        </div>
      </section>

      <h2 style={{ marginTop:'2rem' }}>Add Product</h2>
      <form className="product-form" action={createProduct}>
        <label>Title<input name="title" required /></label>
        <label>Slug<input name="slug" placeholder="auto-from-title" /></label>
        <label>Category<input name="category" required /></label>
        <label>Hero Image URL<input name="heroImage" required /></label>
        <label>Description<textarea name="description" rows={3} /></label>
        <label>Price (BDT)<input name="price" type="number" required /></label>
        <label>SKU<input name="sku" required /></label>
        <label>Color<input name="color" required /></label>
        <label>Size<input name="size" required /></label>
        <div style={{ gridColumn:'1 / -1' }}>
          <button type="submit">Create</button>
        </div>
      </form>

      <h2 style={{ marginTop:'2rem' }}>Products</h2>
      <Suspense>
        <AdminAnimatedGrid products={products} />
      </Suspense>
    </main>
  );
}
