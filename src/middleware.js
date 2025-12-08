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

  // Оптимизированная обработка поддоменов *.cvirko-vadim.ru
  // Wildcard SSL сертификат покрывает все поддомены автоматически
  const domainPattern = /^([^.]+)\.cvirko-vadim\.ru$/;
  const subdomainMatch = hostname?.match(domainPattern);

  if (subdomainMatch) {
    const subdomain = subdomainMatch[1]; // Извлекаем имя поддомена (например, 'phone2' из 'phone2.cvirko-vadim.ru')
    const newUrl = new URL(request.url);
    newUrl.pathname = `/${subdomain}${url.pathname}`;

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
