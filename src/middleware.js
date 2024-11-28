import { NextResponse } from 'next/server'

export function middleware(req) {
	const url = req.nextUrl.clone()
	const hostname = req.headers.get('host') // Получаем hostname

	console.log('Hostname:', hostname)

	// Проверяем, если запрос идет на статические файлы или системные пути Next.js
	const staticPaths = ['/static', '/_next', '/favicon.ico']
	if (staticPaths.some((path) => url.pathname.startsWith(path))) {
		return NextResponse.next()
	}

	// Добавляем префиксы для поддоменов
	if (hostname === 'phone.cvirko-vadim.ru') {
		url.pathname = `/phone${url.pathname}`
		return NextResponse.rewrite(url)
	}

	if (hostname === 'tv1.cvirko-vadim.ru') {
		url.pathname = `/tv1${url.pathname}`
		return NextResponse.rewrite(url)
	}

	return NextResponse.next()
}
