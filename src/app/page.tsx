import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Hero } from './components';

export default function Landing() {
  const role = cookies().get('role')?.value;
  if (role === 'retail') redirect('/retail');
  if (role === 'client') redirect('/client');
  return (
    <>
      <div className="container" style={{ marginTop:'1rem', marginBottom:'3rem' }}>
        <Hero />
      </div>
  {/* Footer injected by layout except on excluded routes */}
    </>
  );
}
