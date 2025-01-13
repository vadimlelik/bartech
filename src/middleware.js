import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

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
