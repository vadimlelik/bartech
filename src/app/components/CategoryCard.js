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
					height: '300px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'linear-gradient(45deg, #f3f4f6 0%, #fff 100%)',
					padding: 2,
					borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
				}}
			>
				<CardMedia
					component='img'
					sx={{
						maxWidth: '100%',
						maxHeight: '100%',
						width: 'auto',
						height: 'auto',
						objectFit: 'contain',
						borderRadius: 1,
						transition: 'transform 0.3s ease-in-out',
						'&:hover': {
							transform: 'scale(1.05)',
						},
					}}
					image={category.imageUrl}
					alt={category.name}
				/>
			</Box>
			<CardContent
				sx={{
					flexGrow: 1,
					background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
					padding: 3,
				}}
			>
				<Typography
					gutterBottom
					variant='h5'
					component='div'
					sx={{
						fontWeight: '600',
						textAlign: 'center',
						color: '#2c3e50',
						mb: 2,
					}}
				>
					{category.name}
				</Typography>
				<Typography
					variant='body2'
					sx={{
						textAlign: 'center',
						color: '#64748b',
						lineHeight: 1.6,
					}}
				>
					{category.description}
				</Typography>
			</CardContent>
		</Card>
	)
}
