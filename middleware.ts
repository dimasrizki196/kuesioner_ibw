// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Pastikan ada kata kunci 'export' sebelum 'function middleware'
export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // Proteksi folder admin
  if (pathname.startsWith('/admin')) {
    // Kecualikan halaman login agar tidak terjadi infinite redirect
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Jika mencoba akses dashboard/results tanpa cookie
    if (!adminSession || adminSession.value !== 'is_logged_in') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Config ini menentukan route mana saja yang akan diproses middleware
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};