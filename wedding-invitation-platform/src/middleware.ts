import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protects every /admin/* route except /admin/login.
 * Refreshes the Supabase session cookie on each request.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPage && !isLoginPage && !session) {
    const redirectUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
