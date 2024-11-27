export function middleware(req) {
	const res = new Response(null, { status: 204 })

	res.headers.set('Access-Control-Allow-Origin', '*')
	res.headers.set(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, DELETE'
	)
	res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
	res.headers.set('Access-Control-Allow-Credentials', 'true')

	if (req.method === 'OPTIONS') {
		return res
	}

	return NextResponse.next()
}
