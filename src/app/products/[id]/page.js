import { Container } from '@mui/material'
import ProductDetails from './ProductDetails'
import Breadcrumbs from '@/components/Breadcrumbs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

async function getProduct(id) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`
		)
		if (!response.ok) {
			const errorData = await response.json()
			throw new Error('Failed to fetch product')
		}
		const data = await response.json()
		return data.product
	} catch (error) {
		return null
	}
}

function getCategoryLabel(categoryId) {
	const categories = {
		iphone: 'iPhone',
		samsung: 'Samsung',
		xiaomi: 'Xiaomi',
	}
	return categories[categoryId] || categoryId
}

// Эта функция нужна для получения статических параметров при сборке
export async function generateStaticParams() {
	return []
}

export async function generateMetadata({ params }) {
	const resolvedParams = await params
	const { id } = resolvedParams
	if (!id) return { title: 'Товар не найден' }

	const product = await getProduct(id)
	if (!product) return { title: 'Товар не найден' }

	console.log('product', product)

	return {
		title: `${product.name} - Bartech`,
		description: product.description || 'Описание товара отсутствует',
	}
}

export default async function ProductPage({ params }) {
	const resolvedParams = await params
	const { id } = resolvedParams

	const product = await getProduct(id)

	if (!product) {
		return (
			<div>
				<h1>Товар не найден</h1>
				<p>ID товара: {id}</p>
			</div>
		)
	}

	const breadcrumbs = [
		{ label: 'Главная', href: '/' },
		{ label: 'Категории', href: '/categories' },
		{
			label: getCategoryLabel(product.categoryId),
			href: `/categories/${product.categoryId}`,
		},
		{ label: product.name, href: null },
	]

	return (
		<>
			<Header />
			<Container maxWidth='lg' sx={{ py: 4 }}>
				<Breadcrumbs items={breadcrumbs} />
				<ProductDetails product={product} />
			</Container>
			<Footer />
		</>
	)
}
