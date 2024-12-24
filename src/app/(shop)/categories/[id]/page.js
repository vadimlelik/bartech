import { Container, Grid, Typography, Box } from '@mui/material'
import BackButton from './BackButton'
import ProductList from './ProductList'
import { getCategoryById } from '@/lib/categories'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateMetadata({ params }) {
	try {
		const resolvedParams = await Promise.resolve(params)
		const { id } = resolvedParams

		console.log('Category Metadata - Params:', resolvedParams)
		console.log('Category Metadata - ID:', id)

		if (!id) {
			console.log('Category Metadata - No ID provided')
			return {
				title: 'Категория не найдена',
				description: 'Категория не найдена',
			}
		}

		const category = await getCategoryById(id)

		if (!category) {
			console.log('Category Metadata - Category not found')
			return {
				title: 'Категория не найдена',
				description: 'Категория не найдена',
			}
		}

		return {
			title: `${category.name} - Bartech`,
			description: `Купить ${category.name.toLowerCase()} в Минске с доставкой`,
		}
	} catch (error) {
		console.error('Error in generateMetadata:', error)
		return {
			title: 'Ошибка',
			description: 'Произошла ошибка при загрузке категории',
		}
	}
}

export default async function CategoryPage({ params }) {
	try {
		const category = await getCategoryById(params.id)

		if (!category) {
			notFound()
		}

		return (
			<>
				<Box
					sx={{
						minHeight: '100vh',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Container maxWidth='lg' sx={{ py: 4, flex: 1 }}>
						<BackButton />
						<Typography variant='h4' component='h1' gutterBottom sx={{ mt: 2 }}>
							{category.name}
						</Typography>
						<ProductList categoryId={category.id} />
					</Container>
				</Box>
			</>
		)
	} catch (error) {
		console.error('Error in CategoryPage:', error)
		throw error
	}
}
