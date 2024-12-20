import { Container, Grid, Typography, Box } from '@mui/material'
import CategoryCard from './components/CategoryCard'
import { getCategories } from '@/lib/categories'

export const metadata = {
	title: 'Магазин телефонов - Главная страница',
	description: 'Купить телефон в рассрочку',
}

export default async function Home() {
	const categories = await getCategories()

	return (
		<Box component='main' sx={{ flex: 1 }}>
			<Container sx={{ py: 4 }}>
				<Typography variant='h4' component='h1' gutterBottom>
					Категории
				</Typography>
				<Grid container spacing={3}>
					{categories.map((category) => (
						<Grid item xs={12} sm={6} md={4} key={category.id}>
							<CategoryCard category={category} />
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	)
}
