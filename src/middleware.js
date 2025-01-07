import { NextResponse } from 'next/server';

export function middleware(req) {
  const hostname = req.headers.get('host'); // Получаем хост (например, phone.cvirko-vadim.ru)
  const url = req.nextUrl.clone();

  // Пропускаем запросы к статическим файлам
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/styles') ||
    url.pathname.startsWith('/logo')
  ) {
    return NextResponse.next();
  }

  const subdomain = hostname.split('.')[0]; // Извлекаем поддомен (например, 'phone')

  if (subdomain === 'phone') {
    url.pathname = `/phone${url.pathname}`; // Перенаправляем запросы на /phone
    return NextResponse.rewrite(url);
  }

  return NextResponse.next(); // Для всех остальных запросов
}
