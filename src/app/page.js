import { Container, Typography, Box } from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import CategoryCard from './components/CategoryCard'
import clientPromise from '../lib/mongodb'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
	title: 'Магазин телефонов - Главная страница',
	description:
		'Купить телефоны различных брендов: iPhone, Samsung, Xiaomi и другие',
}

async function getCategories() {
	try {
		const client = await clientPromise
		const db = client.db('bartech')

		const categories = await db.collection('categories').find({}).toArray()
		console.log('Categories fetched:', categories)

		return JSON.parse(JSON.stringify(categories))
	} catch (error) {
		console.error('Error fetching categories:', error)
		return []
	}
}

export default async function Home() {
	const categories = await getCategories()

	return (
		<>
			<Header />
			<Box
				sx={{
					minHeight: '100vh',
					background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
					py: 4,
				}}
			>
				<Container
					maxWidth='lg'
					sx={{
						py: 4,
						px: { xs: 2, sm: 3, md: 4 },
					}}
				>
					<Typography
						variant='h3'
						component='h1'
						align='center'
						gutterBottom
						sx={{
							fontWeight: 600,
							color: '#1a237e',
							mb: 4,
							fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
							textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
						}}
					>
						Категории товаров
					</Typography>
					<Grid2
						container
						spacing={3}
						columns={2} 
						sx={{ 
							mt: 2,
							justifyContent: 'center' 
						}}
					>
						{categories.map((category) => (
							<Grid2 
								key={category._id} 
								xs={2} 
								sm={1} 
								sx={{
									maxWidth: '500px' 
								}}
							>
								<CategoryCard category={category} />
							</Grid2>
						))}
					</Grid2>
				</Container>
			</Box>
			<Footer />
		</>
	)
}
