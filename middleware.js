import { NextResponse } from 'next/server'

export function middleware(req) {
	const url = req.nextUrl.clone()
	const origin = req.headers.get('origin')
	const hostname = req.headers.get('host')?.split(':')[0] // Убираем порт
	const allowedOrigins = [
		'https://cvirko-vadim.ru',
		'https://phone.cvirko-vadim.ru',
		'https://tv1.cvirko-vadim.ru',
	]

	const res = NextResponse.next()
	if (origin && allowedOrigins.includes(origin)) {
		res.headers.set('Access-Control-Allow-Origin', origin)
	} else {
		res.headers.set('Access-Control-Allow-Origin', '*')
	}
	res.headers.set(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, DELETE'
	)
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	res.headers.set('Access-Control-Allow-Credentials', 'true')

	if (req.method === 'OPTIONS') {
		return res
	}

	// Перенаправление для поддоменов
	if (hostname === 'phone.cvirko-vadim.ru') {
		url.pathname = `/phone${url.pathname}`
		return NextResponse.rewrite(url)
	}

	if (hostname === 'tv1.cvirko-vadim.ru') {
		url.pathname = `/tv1${url.pathname}`
		return NextResponse.rewrite(url)
	}

	return res
}
