import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CLIENT_COOKIE_NAME, CLIENT_REDIRECT_FALLBACK } from './clientGate';

export function enforceClientAccess(redirectPath: string) {
  const cookieStore = cookies();
  const hasCookie = cookieStore.get(CLIENT_COOKIE_NAME)?.value === 'granted';
  const role = cookieStore.get('role')?.value;
  if (role === 'admin' || hasCookie) {
    return;
  }
  const destination = redirectPath || CLIENT_REDIRECT_FALLBACK;
  redirect(`/client?redirect=${encodeURIComponent(destination)}`);
}
