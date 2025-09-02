'use server';
import { cookies } from 'next/headers';
import { findUserByEmail, allDemoUsers } from '../../lib/data/store';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = (formData.get('email') || '').toString().trim();
  const role = (formData.get('role') || '').toString();
  if (!email || !role) return { error: 'Missing fields' };
  const user = findUserByEmail(email) || allDemoUsers().find(u => u.role === role);
  if (!user) return { error: 'Invalid credentials' };
  cookies().set('role', user.role, { path: '/', httpOnly: false });
  if (user.role === 'retail') redirect('/retail');
  if (user.role === 'client') redirect('/client');
  redirect('/admin');
}

export async function logout() { cookies().delete('role'); redirect('/'); }