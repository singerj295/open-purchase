import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要認證的頁面
const protectedRoutes = [
  '/dashboard',
  '/dashboard/orders',
  '/dashboard/suppliers',
  '/dashboard/inventory',
  '/dashboard/recipes',
  '/dashboard/reports',
  '/dashboard/analytics',
  '/dashboard/settings',
];

// 公開頁面
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 檢查是否有會話（檢查 cookie 或 localStorage）
  const hasSession = request.cookies.get('session')?.value === 'true';

  // 如果訪問保護頁面但未登入
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasSession) {
      // 重定向到登入頁面
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 如果已登入但訪問登入/註冊頁面
  if (publicRoutes.some(route => pathname === route) && hasSession) {
    // 重定向到 Dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
