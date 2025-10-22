import { NextResponse, type NextRequest } from 'next/server';
import { CLIENT_COOKIE_NAME } from './src/lib/auth/clientGate';

export function middleware(req: NextRequest) {
  const role = req.cookies.get('role')?.value;
  const clientAccess = req.cookies.get(CLIENT_COOKIE_NAME)?.value === 'granted';
  const { pathname } = req.nextUrl;

  if (pathname === '/client') {
    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (role !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === '/retail' || pathname.startsWith('/retail/')) {
    if (!role || (role !== 'retail' && role !== 'admin')) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname !== '/client' && (pathname === '/client/catalog' || pathname.startsWith('/client/'))) {
    const hasRoleBypass = role === 'admin';
    if (!hasRoleBypass && !clientAccess) {
      const url = req.nextUrl.clone();
      url.pathname = '/client';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/retail/:path*','/client/:path*','/admin/:path*'] };
