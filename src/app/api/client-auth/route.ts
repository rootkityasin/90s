import { NextResponse, type NextRequest } from 'next/server';
import { CLIENT_ACCESS_PASSWORD, CLIENT_COOKIE_NAME, CLIENT_REDIRECT_FALLBACK } from '../../../lib/auth/clientGate';

export async function GET(request: NextRequest) {
  const hasAccess = request.cookies.get(CLIENT_COOKIE_NAME)?.value === 'granted';
  if (!hasAccess) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }));
  if (!password || password !== CLIENT_ACCESS_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, redirectTo: CLIENT_REDIRECT_FALLBACK });
  response.cookies.set({
    name: CLIENT_COOKIE_NAME,
    value: 'granted',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
