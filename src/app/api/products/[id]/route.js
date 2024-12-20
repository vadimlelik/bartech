import { getProductById } from '@/lib/products'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
	try {
		console.log('=== API Route Debug ===')
		console.log('1. Request URL:', request.url)
		console.log('2. Raw params:', params)
		
		const resolvedParams = await Promise.resolve(params)
		console.log('3. Resolved params:', resolvedParams)
		
		const { id } = resolvedParams
		console.log('4. Extracted ID:', id)

		if (!id) {
			console.log('5. No ID provided, returning 400')
			return NextResponse.json(
				{ error: 'Product ID is required' },
				{ status: 400 }
			)
		}

		const product = await getProductById(id)
		console.log('6. Found product:', product)

		if (!product) {
			console.log('7. Product not found, returning 404')
			return NextResponse.json({ error: 'Product not found' }, { status: 404 })
		}

		console.log('8. Success, returning product')
		return NextResponse.json({ product })
	} catch (error) {
		console.error('9. Error in API route:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
