import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');
  const response = NextResponse.next();

  // Защита админ-роутов
  if (url.pathname.startsWith('/admin')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      // Если Supabase не настроен, разрешаем доступ (для разработки)
      return response;
    }

    try {
      // Создаем Supabase клиент для middleware с поддержкой cookies
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

      // Получаем текущего пользователя
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // Если пользователь не авторизован, перенаправляем на страницу входа
      if (!user || userError) {
        const redirectUrl = new URL('/auth/login', request.url);
        redirectUrl.searchParams.set('redirect', url.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Получаем профиль пользователя
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Если профиль не найден или роль не admin, перенаправляем на главную
      if (!profile || profileError || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Если все проверки пройдены, разрешаем доступ
      return response;
    } catch (error) {
      console.error('Error in admin middleware:', error);
      // В случае ошибки перенаправляем на главную
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Карта соответствия поддоменов и путей
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

  // Проверяем, есть ли поддомен в нашей карте
  if (subdomainMap[hostname]) {
    // Создаем новый URL с правильным путем
    const newUrl = new URL(request.url);
    newUrl.pathname = `${subdomainMap[hostname]}${url.pathname}`;

    // Логируем для отладки

    return NextResponse.rewrite(newUrl);
  }

  // Проверяем, если запрос идет на статические файлы или системные пути Next.js
  const staticPaths = ['/static', '/_next', '/favicon.ico'];
  if (staticPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Исключаем системные пути
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
