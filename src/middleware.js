import { NextResponse } from 'next/server';

export function middleware(req) {
  const hostname = req.headers.get('host'); // Например, phone.cvirko-vadim.ru
  const subdomain = hostname.split('.')[0]; // Извлекаем поддомен (phone)

  if (subdomain === 'phone') {
    // Перенаправляем запросы поддомена phone на папку /phone
    req.nextUrl.pathname = `/phone${req.nextUrl.pathname}`;
    return NextResponse.rewrite(req.nextUrl);
  }

  // Для других поддоменов или основного домена ничего не делаем
  return NextResponse.next();
}
