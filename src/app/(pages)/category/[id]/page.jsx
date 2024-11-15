import Link from 'next/link'
import React from 'react'

async function fetchProductsByCategory(categoryId) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/products?categoryId=${categoryId}`,
		{
			cache: 'no-store',
		}
	)
	if (!res.ok) {
		throw new Error('Failed to fetch products')
	}
	return res.json()
}

const Category = async ({ params }) => {
	const { id } = params
	const products = await fetchProductsByCategory(id)

	return (
		<main>
			<h1>Товары категории: {id}</h1>
			<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
				{products.map((product) => (
					<Link
						key={product.id}
						href={`/product/${product.id}`}
						style={{
							padding: '1rem',
							border: '1px solid #ccc',
							borderRadius: '8px',
							textDecoration: 'none',
							display: 'block',
							width: '200px',
							textAlign: 'center',
						}}
					>
						<h2>{product.name}</h2>
						<p>{product.description}</p>
						<p>${product.price}</p>
					</Link>
				))}
			</div>
		</main>
	)
}

export default Category
