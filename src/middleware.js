import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');
  const response = NextResponse.next();

  if (url.pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return response;
    }

    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name, options) {
            request.cookies.set({ name, value: '', ...options });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      });

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('redirect', url.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profileError || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return response;
    } catch (error) {
      console.error('Error in admin middleware:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const subdomainMap = {
    'phone2.technobar.by': '/phone2',
    'tv1.technobar.by': '/tv1',
    '1phonefree.technobar.by': '/1phonefree',
    '50discount.technobar.by': '/50discount',
    'phone.technobar.by': '/phone',
    'phone3.technobar.by': '/phone3',
    'phone4.technobar.by': '/phone4',
    'phone5.technobar.by': '/phone5',
    'phone6.technobar.by': '/phone6',
    'shockproof_phone.technobar.by': '/shockproof_phone',
    'laptop.technobar.by': '/laptop',
    'bicycles.technobar.by': '/bicycles',
    'motoblok.technobar.by': '/motoblok',
    'pc.technobar.by': '/pc',
    'scooter.technobar.by': '/scooter',
    'laptop_2.technobar.by': '/laptop_2',
    'tv2.technobar.by': '/tv2',
    'tv3.technobar.by': '/tv3',
    'motoblok_1.technobar.by': '/motoblok_1',
    'motoblok_2.technobar.by': '/motoblok_2',
  };

  if (subdomainMap[hostname]) {
    const newUrl = new URL(request.url);
    newUrl.pathname = `${subdomainMap[hostname]}${url.pathname}`;

    return NextResponse.rewrite(newUrl);
  }

  const staticPaths = ['/static', '/_next', '/favicon.ico'];
  if (staticPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
