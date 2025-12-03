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
    'phone2.cvirko-vadim.ru': '/phone2',
    'tv1.cvirko-vadim.ru': '/tv1',
    '1phonefree.cvirko-vadim.ru': '/1phonefree',
    '50discount.cvirko-vadim.ru': '/50discount',
    'phone.cvirko-vadim.ru': '/phone',
    'phone3.cvirko-vadim.ru': '/phone3',
    'phone4.cvirko-vadim.ru': '/phone4',
    'phone5.cvirko-vadim.ru': '/phone5',
    'phone6.cvirko-vadim.ru': '/phone6',
    'shockproof_phone.cvirko-vadim.ru': '/shockproof_phone',
    'laptop.cvirko-vadim.ru': '/laptop',
    'bicycles.cvirko-vadim.ru': '/bicycles',
    'motoblok.cvirko-vadim.ru': '/motoblok',
    'pc.cvirko-vadim.ru': '/pc',
    'scooter.cvirko-vadim.ru': '/scooter',
    'laptop_2.cvirko-vadim.ru': '/laptop_2',
    'tv2.cvirko-vadim.ru': '/tv2',
    'tv3.cvirko-vadim.ru': '/tv3',
    'motoblok_1.cvirko-vadim.ru': '/motoblok_1',
    'motoblok_2.cvirko-vadim.ru': '/motoblok_2',
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
