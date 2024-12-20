import { Container, Grid, Typography, Box } from '@mui/material'
import BackButton from './BackButton'
import ProductList from './ProductList'
import { getCategoryById } from '@/lib/categories'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
    try {
        // Дожидаемся разрешения всего объекта params
        const resolvedParams = await Promise.resolve(params)
        const { id } = resolvedParams

        console.log('Category Metadata - Params:', resolvedParams)
        console.log('Category Metadata - ID:', id)

        if (!id) {
            console.log('Category Metadata - No ID provided')
            return {
                title: 'Категория не найдена',
                description: 'Запрашиваемая категория не найдена'
            }
        }

        const category = await getCategoryById(id)
        console.log('Category Metadata - Found category:', category)

        if (!category) {
            console.log('Category Metadata - Category not found')
            return {
                title: 'Категория не найдена',
                description: 'Запрашиваемая категория не найдена'
            }
        }

        const metadata = {
            title: `${category.name} - Телефоны`,
            description: `Купить телефоны ${category.name} в нашем магазине`,
        }
        console.log('Category Metadata - Generated:', metadata)
        return metadata
    } catch (error) {
        console.error('Error generating category metadata:', error)
        return {
            title: 'Ошибка',
            description: 'Произошла ошибка при загрузке категории'
        }
    }
}

export default async function CategoryPage({ params }) {
    try {
        // Дожидаемся разрешения всего объекта params
        const resolvedParams = await Promise.resolve(params)
        const { id } = resolvedParams

        console.log('Category Page - Params:', resolvedParams)
        console.log('Category Page - ID:', id)

        if (!id) {
            console.log('Category Page - No ID provided')
            notFound()
        }

        const category = await getCategoryById(id)
        console.log('Category Page - Found category:', category)

        if (!category) {
            console.log('Category Page - Category not found')
            notFound()
        }

        return (
            <main>
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Container sx={{ py: 4, flex: 1 }}>
                        <BackButton />
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            align="center"
                            sx={{ mb: 4 }}
                        >
                            {category.name}
                        </Typography>
                        {category.description && (
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                align="center"
                                sx={{ mb: 4 }}
                            >
                                {category.description}
                            </Typography>
                        )}
                        <ProductList categoryId={category.id} />
                    </Container>
                </Box>
            </main>
        )
    } catch (error) {
        console.error('Error in CategoryPage:', error)
        notFound()
    }
}
