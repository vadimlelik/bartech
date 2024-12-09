import React from 'react'
import { notFound, redirect } from 'next/navigation'
import style from './page.module.css'
import Button from '@/app/components/button/Button'

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
		if (!id) {
			return redirect('/')
		}

		const product = await fetchProductById(id)

		if (!product) {
			notFound()
		}

		return (
			<main className={style.productPage}>
				<div className={style.productCard}>
					<img
						src={product.imageUrl || '/placeholder.png'}
						alt={product.name || 'Product Image'}
						className={style.productImage}
					/>
					<div className={style.productInfo}>
						<h1 className={style.productTitle}>{product.name}</h1>
						<p className={style.productDescription}>{product.description}</p>
						<p className={style.productPrice}>Цена: ${product.price}</p>
						<Button
							label='Купить'
							color='primary'
							className={style.productButton}
						/>
					</div>
				</div>
			</main>
		)
	} catch (error) {
		notFound()
	}
}

export default Product
