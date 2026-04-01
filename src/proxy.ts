import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isVerified = request.cookies.get('isVerified')?.value === 'true';
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isVerified) {
      const userStr = request.cookies.get('user')?.value;
      const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
      const verifyUrl = new URL('/verify-email', request.url);
      if (user?.email) {
        verifyUrl.searchParams.set('email', user.email);
      }
      return NextResponse.redirect(verifyUrl);
    }
  }

  // Redirect verified/logged-in users away from auth pages
  if (token && isVerified && (pathname === '/login' || pathname === '/register' || pathname === '/verify-email')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/verify-email'],
};
