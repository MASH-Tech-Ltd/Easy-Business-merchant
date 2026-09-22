import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
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
    // Construct the correct merchant URL
    const protocol = hostname.includes('localhost') ? 'http' : 'https';
    // If it's localhost, we just redirect to the same host for dev purposes. Otherwise, use merchant.masheco.com
    const redirectHost = hostname.includes('localhost') ? hostname : 'merchant.masheco.com';
    
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
