import { NextResponse } from 'next/server';

export function middleware(req) {
  const hostname = req.headers.get('host'); // Получаем хост (например, sub.example.com)
  const subdomain = hostname.split('.')[0]; // Извлекаем поддомен (sub)

  if (subdomain && subdomain !== 'www' && subdomain !== 'cvirko-vadim.ru') {
    req.nextUrl.pathname = `/${subdomain}${req.nextUrl.pathname}`;
    return NextResponse.rewrite(req.nextUrl);
  }

  // Для основного домена продолжаем обработку
  return NextResponse.next();
}
