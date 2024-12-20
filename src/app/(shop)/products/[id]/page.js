import { Container, Box } from '@mui/material'
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
    try {
        const product = await getProductById(params.id)

        if (!product) {
            return {
                title: 'Продукт не найден',
                description: 'Запрашиваемый продукт не найден'
            }
        }

        return {
            title: `${product.name} - Купить в магазине`,
            description: product.description || `Купить ${product.name} в Минске с доставкой`
        }
    } catch (error) {
        console.error('Error generating product metadata:', error)
        return {
            title: 'Ошибка',
            description: 'Произошла ошибка при загрузке продукта'
        }
    }
}

export default async function ProductPage({ params }) {
    const product = await getProductById(params.id)
    
    if (!product) {
        notFound()
    }

    const category = await getCategoryById(product.category)

    const breadcrumbs = [
        { 
            label: 'Главная',
            href: '/'
        },
        { 
            label: category?.name || 'Категория',
            href: `/categories/${category?.id}`
        },
        { 
            label: product.name,
            href: `/products/${product.id}`
        }
    ]

    return (
        <Box component="main" sx={{ flex: 1 }}>
            <Container maxWidth='lg' sx={{ py: 4, minHeight: '100vh' }}>
                <Breadcrumbs items={breadcrumbs} />
                <ProductDetails product={product} />
            </Container>
        </Box>
    )
}
