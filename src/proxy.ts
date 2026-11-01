import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === '/admin/login') return NextResponse.redirect(new URL('/login?next=/admin', request.url));
  if (pathname === '/register' || pathname === '/bantuan') return NextResponse.redirect(new URL('/', request.url));
  if (
    ['/admin/faqs', '/admin/announcements', '/admin/payouts', '/admin/refunds', '/admin/complaints', '/admin/manual-top-ups'].includes(pathname)
  )
    return NextResponse.redirect(new URL('/admin', request.url));
  if (pathname === '/login') return NextResponse.next();
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (
    request.cookies.has('bongastore-admin-access') ||
    request.cookies.has('__Host-bongastore-admin-access') ||
    request.cookies.has('jokihub-admin-access') ||
    request.cookies.has('__Host-jokihub-admin-access')
  )
    return NextResponse.next();
  if (
    request.cookies.has('bongastore-admin-refresh') ||
    request.cookies.has('__Host-bongastore-admin-refresh') ||
    request.cookies.has('jokihub-admin-refresh') ||
    request.cookies.has('__Host-jokihub-admin-refresh')
  )
    return NextResponse.redirect(new URL('/login?refresh=admin', request.url));
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ['/admin/:path*', '/login', '/register', '/bantuan'] };
