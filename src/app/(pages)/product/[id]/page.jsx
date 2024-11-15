import React from 'react'
import { notFound, redirect } from 'next/navigation'

async function fetchProductById(productId) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/products?id=${productId}`,
		{
			cache: 'no-store',
		}
	)
	if (!res.ok) {
		throw new Error('Failed to fetch product')
	}
	return res.json()
}

const Product = async ({ params }) => {
	try {
		const { id } = params
		const product = await fetchProductById(id)
		if (!product) {
			return redirect('/')
		}
		return (
			<main>
				<h1>{product.name}</h1>
				<p>{product.description}</p>
				<p>Цена: ${product.price}</p>
			</main>
		)
	} catch (error) {
		notFound()
	}
}

export default Product
