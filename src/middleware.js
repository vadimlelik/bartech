import { NextResponse } from 'next/server'

export function middleware(req) {
	// Создаем новый ответ
	const res = new Response(null, { status: 204 })

	// Устанавливаем базовые заголовки CORS
	const allowedOrigins = [
		'https://cvirko-vadim.ru/', // Ваш основной домен
		'https://phone.cvirko-vadim.ru/', // Поддомен
		// Добавьте сюда другие допустимые домены
	]

	const origin = req.headers.get('origin')

	// Проверяем, разрешен ли origin
	if (allowedOrigins.includes(origin)) {
		res.headers.set('Access-Control-Allow-Origin', origin) // Устанавливаем Origin для безопасности
	} else {
		res.headers.set('Access-Control-Allow-Origin', '*') // Разрешаем доступ всем для демонстрационных целей
	}

	res.headers.set(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, DELETE'
	)
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	res.headers.set('Access-Control-Allow-Credentials', 'true')

	// Обрабатываем preflight-запросы (OPTIONS)
	if (req.method === 'OPTIONS') {
		return res
	}

	// Продолжаем обработку для всех остальных запросов
	return NextResponse.next()
}
