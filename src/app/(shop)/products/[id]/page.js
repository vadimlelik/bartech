import { Container } from '@mui/material'
import ProductDetails from './ProductDetails'
import Breadcrumbs from '@/components/Breadcrumbs'
import { getProductById } from '@/lib/products'
import { getCategoryById } from '@/lib/categories'
import { notFound } from 'next/navigation'

// Эта функция нужна для получения статических параметров при сборке
export async function generateStaticParams() {
	return []
}

export async function generateMetadata({ params }) {
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    const product = await getProductById(id)
    if (!product) {
        return {
            title: 'Товар не найден',
            description: 'Запрашиваемый товар не найден в магазине',
        }
    }

    return {
        title: `${product.name} - Купить в магазине`,
        description: product.description || '',
    }
}

export default async function ProductPage({ params }) {
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    console.log('Debug - Product Page:')
    console.log('1. Resolved Params:', resolvedParams)
    console.log('2. Product ID:', id)

    const product = await getProductById(id)
    console.log('3. Found Product:', product)

    if (!product) {
        console.log('4. Product not found, redirecting to 404')
        notFound()
    }

    const category = await getCategoryById(product.category)
    console.log('5. Found Category:', category)

    const breadcrumbs = [
        {
            label: 'Главная',
            href: '/',
        },
        ...(category ? [{
            label: category.name,
            href: `/categories/${category.id}`,
        }] : []),
        {
            label: product.name,
            href: `/products/${product.id}`,
        },
    ]

    return (
        <main>
            <Container maxWidth='lg' sx={{ py: 4, minHeight: '100vh' }}>
                <Breadcrumbs items={breadcrumbs} />
                <ProductDetails product={product} />
            </Container>
        </main>
    )
}
