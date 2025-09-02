import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED: Record<string, string[]> = {
  '/retail': ['retail','admin'],
  '/client': ['client','admin'],
  '/admin': ['admin']
};

export function middleware(req: NextRequest) {
  const role = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;
  for (const base of Object.keys(PROTECTED)) {
    if (pathname === base || pathname.startsWith(base + '/')) {
      if (!role || !PROTECTED[base].includes(role)) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/retail/:path*','/client/:path*','/admin/:path*'] };