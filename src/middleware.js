import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host');

  // Карта соответствия поддоменов и путей
  const subdomainMap = {
    'phone2.cvirko-vadim.ru': '/phone2',
    'tv1.cvirko-vadim.ru': '/tv1',
    '1phonefree.cvirko-vadim.ru': '/1phonefree',
    '50discount.cvirko-vadim.ru': '/50discount',
    'phone.cvirko-vadim.ru': '/phone',
    'phone3.cvirko-vadim.ru': '/phone3',
    'phone4.cvirko-vadim.ru': '/phone4',
    'phone5.cvirko-vadim.ru': '/phone5',
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
