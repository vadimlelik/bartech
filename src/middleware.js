import { NextResponse } from 'next/server'

export function middleware(req) {
	const url = req.nextUrl.clone()
	const hostname = req.headers.get('host')?.split(':')[0] // Извлечение хоста
	console.log('Hostname:', hostname) // Логирование хоста

	if (hostname === 'phone.cvirko-vadim.ru') {
		url.pathname = `/phone${url.pathname}`
		console.log('Redirecting to:', url.toString())
		return NextResponse.rewrite(url)
	}

	if (hostname === 'tv1.cvirko-vadim.ru') {
		url.pathname = `/tv1${url.pathname}`
		console.log('Redirecting to:', url.toString())
		return NextResponse.rewrite(url)
	}

	return NextResponse.next()
}
