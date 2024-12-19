'use client'
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function CategoryCard({ category }) {
	const router = useRouter()

	const handleClick = () => {
		router.push(`/categories/${category.name.toLowerCase()}`)
	}

	return (
		<Card
			onClick={handleClick}
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				transition: 'all 0.3s ease-in-out',
				borderRadius: 2,
				overflow: 'hidden',
				boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
				background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
				mx: 'auto', // Центрируем карточку
				'&:hover': {
					transform: 'translateY(-8px)',
					boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
					cursor: 'pointer',
				},
			}}
		>
			<Box
				sx={{
					position: 'relative',
					paddingTop: '75%', // Соотношение сторон 4:3
					background: 'linear-gradient(45deg, #f3f4f6 0%, #fff 100%)',
					borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
				}}
			>
				<CardMedia
					component='img'
					image={category.image || '/placeholder-category.jpg'}
					alt={category.name}
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						objectFit: 'contain',
						padding: 3,
					}}
				/>
			</Box>
			<CardContent
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					textAlign: 'center',
					p: 3,
				}}
			>
				<Typography
					variant='h5'
					component='h2'
					sx={{
						fontWeight: 600,
						mb: 1,
						color: '#1a237e',
						fontSize: { xs: '1.25rem', sm: '1.5rem' },
					}}
				>
					{category.name}
				</Typography>
				{category.description && (
					<Typography
						variant='body2'
						color='text.secondary'
						sx={{
							mt: 1,
							lineHeight: 1.6,
							fontSize: { xs: '0.875rem', sm: '1rem' },
						}}
					>
						{category.description}
					</Typography>
				)}
			</CardContent>
		</Card>
	)
}
