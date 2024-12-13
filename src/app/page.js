import CartButton from '@/featuirice/add-button'
import BrandSelect from '@/featuirice/brand-select/brand-select'
import Grid from '@mui/material/Grid2'
import { Box, Button, Typography } from '@mui/material'

async function getPhones(query) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/phones?${query}`,
		{
			cache: 'no-store',
		}
	)

	if (!res.ok) {
		throw new Error('Failed to fetch phones')
	}

	return res.json()
}

export default async function Home({ searchParams }) {
	const resolvedSearchParams = await searchParams

	const filters = {
		brand: resolvedSearchParams?.brand || '',
		price: resolvedSearchParams?.price || '',
		color: resolvedSearchParams?.color || '',
	}
	const query = new URLSearchParams(filters).toString()
	const phones = await getPhones(query)

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' gutterBottom>
				Магазин телефонов
			</Typography>
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					mb: 3,
				}}
			>
				<BrandSelect />
				<Button
					type='submit'
					variant='contained'
					color='primary'
					href={`?brand=${filters.brand}`}
				>
					Применить фильтр
				</Button>
			</Box>

			<Grid container spacing={2}>
				{phones.map((phone) => (
					<Grid xs={12} sm={6} md={4} key={phone.id}>
						<Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
							<Typography variant='h6'>{phone.name}</Typography>
							<Typography>Бренд: {phone.brand}</Typography>
							<Typography>Цена: ${phone.price}</Typography>
							<Typography>Цвет: {phone.color}</Typography>
							<CartButton phone={phone} />
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}
