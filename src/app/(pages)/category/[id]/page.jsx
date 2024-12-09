import Link from 'next/link'
import React from 'react'
import styles from './category.module.css'

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
		<>
			<h1>Товары категории: {id}</h1>
			<div className={styles.CategoryList}>
				{products.map((product) => (
					<Link
						key={product.id}
						href={`/product/${product.id}`}
						className={styles.CategoryItem}
					>
						<div className={styles.CategoryImageContainer}>
							<img
								src={product.imageUrl || '/placeholder.png'}
								alt={product.name}
								className={styles.CategoryImage}
							/>
						</div>
						<h2 className={styles.CategoryTitle}>{product.name}</h2>
						<p className={styles.CategoryDescription}>{product.description}</p>
						<p className={styles.CategoryPrice}>${product.price}</p>
					</Link>
				))}
			</div>
		</>
	)
}

export default Category
