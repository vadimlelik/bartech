import { Container, Grid, Typography, Box } from '@mui/material'
import BackButton from './BackButton'
import ProductList from './ProductList'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateMetadata({ params }) {
	console.log('params', params)

	const id = params?.id || ''
	return {
		title: `${id.charAt(0).toUpperCase() + id.slice(1)} - Телефоны`,
		description: `Купить телефоны ${id} в нашем магазине`,
	}
}

export default async function CategoryPage({ params }) {
	const id = params?.id || ''
	const categoryName = id.charAt(0).toUpperCase() + id.slice(1)

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
				<Container maxWidth='lg' sx={{ py: 4 }}>
					<BackButton />

					<Typography
						variant='h4'
						component='h1'
						gutterBottom
						sx={{
							fontWeight: 'bold',
							color: 'primary.main',
							textAlign: 'center',
							mb: 4,
						}}
					>
						{categoryName}
					</Typography>

					<ProductList id={id} />
				</Container>
			</Box>
			<Footer />
		</>
	)
}
