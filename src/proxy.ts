import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Check if the current request is for the merchant subdomain
  const isMerchant = hostname.startsWith('merchant.');

  // 1. If someone accesses merchant.masheco.com/ directly, redirect to login
  if (isMerchant && url.pathname === '/') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. If someone accesses www.masheco.com/login (or dashboard), redirect to the merchant domain
  if (!isMerchant && (url.pathname.startsWith('/login') || url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/register'))) {
    // If we are in development mode or it's localhost, don't redirect to avoid infinite loops during local dev
    if (process.env.NODE_ENV === 'development' || hostname.includes('localhost')) {
      return NextResponse.next();
    }
    
    // Construct the correct merchant URL
    const protocol = 'https';
    const redirectHost = 'merchant.masheco.com';
    
    const merchantUrl = new URL(url.pathname, `${protocol}://${redirectHost}`);
    merchantUrl.search = url.search;
    return NextResponse.redirect(merchantUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
