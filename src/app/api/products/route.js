import { products } from '@/data/products'

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const productId = searchParams.get('id')
	const categoryId = searchParams.get('categoryId')

	if (productId) {
		const product = products.find((p) => p.id === productId)
		if (!product) {
			return new Response(JSON.stringify({ error: 'Product not found' }), {
				status: 404,
			})
		}
		return new Response(JSON.stringify(product), {
			headers: { 'Content-Type': 'application/json' },
		})
	}

	const filteredProducts = categoryId
		? products.filter((product) => product.category === categoryId)
		: products

	return new Response(JSON.stringify(filteredProducts), {
		headers: { 'Content-Type': 'application/json' },
	})
}
