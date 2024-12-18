'use client'

import { useEffect, useState } from 'react'
import { useFavoritesStore } from '@/store/favorites'
import { useCartStore } from '@/store/cart'
import {
	Box,
	Card,
	CardContent,
	Grid,
	IconButton,
	Typography,
	Button,
	CircularProgress,
	Container,
	Snackbar,
	Alert,
	Badge,
	Tooltip,
} from '@mui/material'
import Link from 'next/link'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Image from 'next/image'

export default function FavoritesPage() {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [snackbarOpen, setSnackbarOpen] = useState(false)
	const [snackbarMessage, setSnackbarMessage] = useState('')
	const [mounted, setMounted] = useState(false)
	const { favorites, removeFromFavorites, clearFavorites } = useFavoritesStore()
	const { cartItems, addToCart } = useCartStore()

	// Эффект для обработки монтирования компонента
	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (!mounted) return

		const fetchProducts = async () => {
			setLoading(true)
			try {
				if (!favorites || favorites.length === 0) {
					setProducts([])
					setLoading(false)
					return
				}

				const params = new URLSearchParams()
				favorites.forEach((id) => params.append('ids', id))

				const response = await fetch(`/api/products?${params.toString()}`)
				const data = await response.json()

				if (!data.products || !Array.isArray(data.products)) {
					setProducts([])
					setSnackbarMessage('Ошибка при загрузке товаров')
					setSnackbarOpen(true)
					return
				}

				// Сортируем продукты в том же порядке, что и в избранном
				const orderedProducts = favorites
					.map((id) => data.products.find((p) => p._id === id))
					.filter(Boolean)
				setProducts(orderedProducts)
			} catch (error) {
				setSnackbarMessage('Ошибка при загрузке товаров')
				setSnackbarOpen(true)
				setProducts([])
			} finally {
				setLoading(false)
			}
		}

		fetchProducts()
	}, [favorites, mounted])

	const handleAddToCart = (product) => {
		if (!product.variants || product.variants.length === 0) {
			return
		}

		const productWithPrice = {
			...product,
			price: product.variants[0].price || 0,
			quantity: 1,
		}
		addToCart(productWithPrice)
		setSnackbarMessage('Товар добавлен в корзину')
		setSnackbarOpen(true)
	}

	// Не рендерим ничего до монтирования компонента
	if (!mounted) {
		return (
			<Container maxWidth='lg' sx={{ mt: 4, pb: 4 }}>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						minHeight: '200px',
					}}
				>
					<CircularProgress />
				</Box>
			</Container>
		)
	}

	return (
		<Container maxWidth='lg' sx={{ mt: 4, pb: 4 }}>
			{/* Плавающая панель с иконками навигации */}
			{cartItems && cartItems.length > 0 && (
				<Box
					sx={{
						position: 'fixed',
						top: '50%',
						right: 16,
						transform: 'translateY(-50%)',
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						zIndex: 1000,
					}}
				>
					<Link href='/cart'>
						<Tooltip title='Перейти в корзину' placement='left'>
							<IconButton
								sx={{
									backgroundColor: 'background.paper',
									'&:hover': { backgroundColor: 'action.hover' },
								}}
							>
								<Badge badgeContent={cartItems.length} color='primary'>
									<ShoppingCartIcon />
								</Badge>
							</IconButton>
						</Tooltip>
					</Link>
				</Box>
			)}

			{/* Снэкбар для уведомлений */}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={() => setSnackbarOpen(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					onClose={() => setSnackbarOpen(false)}
					severity='success'
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>

			{/* Заголовок всегда виден */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 4,
				}}
			>
				<Typography variant='h4'>Закладки</Typography>
				{products && products.length > 0 && !loading && (
					<Button
						variant='outlined'
						color='error'
						onClick={clearFavorites}
						startIcon={<DeleteIcon />}
					>
						Очистить все
					</Button>
				)}
			</Box>

			{loading ? (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						minHeight: '200px',
					}}
				>
					<CircularProgress />
				</Box>
			) : products && products.length > 0 ? (
				<Grid container spacing={2}>
					{products.map((product) => (
						<Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
							<Card
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									cursor: 'pointer',
									transition: 'transform 0.2s, box-shadow 0.2s',
									'&:hover': {
										transform: 'translateY(-4px)',
										boxShadow: 4,
									},
								}}
							>
								<Link
									href={`/products/${product.id || product._id}`}
									style={{
										textDecoration: 'none',
										color: 'inherit',
										display: 'flex',
										flexDirection: 'column',
										flexGrow: 1,
									}}
								>
									<Box sx={{ position: 'relative', pt: '100%' }}>
										{product.images && product.images[0] && (
											<Image
												src={product.images[0]}
												alt={product.name}
												fill
												style={{ objectFit: 'contain' }}
												priority
											/>
										)}
									</Box>
									<CardContent sx={{ flexGrow: 1 }}>
										<Typography variant='h6' component='h2' gutterBottom>
											{product.name}
										</Typography>
										<Typography
											variant='body2'
											color='text.secondary'
											paragraph
										>
											{product.description}
										</Typography>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												mt: 'auto',
											}}
										>
											<Typography variant='h6' color='primary'>
												{product.variants && product.variants[0]
													? `$${product.variants[0].price}`
													: 'Price not available'}
											</Typography>
											<Box>
												<IconButton
													onClick={(e) => {
														e.preventDefault() // Предотвращаем переход по ссылке
														handleAddToCart(product)
													}}
													color='primary'
													aria-label='add to cart'
												>
													<ShoppingCartIcon />
												</IconButton>
												<IconButton
													onClick={(e) => {
														e.preventDefault() // Предотвращаем переход по ссылке
														removeFromFavorites(product._id)
													}}
													color='error'
													aria-label='remove from favorites'
												>
													<DeleteIcon />
												</IconButton>
											</Box>
										</Box>
									</CardContent>
								</Link>
							</Card>
						</Grid>
					))}
				</Grid>
			) : (
				<Box sx={{ textAlign: 'center', py: 4 }}>
					<Typography variant='h6' gutterBottom>
						У вас пока нет товаров в закладках
					</Typography>
					<Link href='/'>
						<Button variant='contained' color='primary' sx={{ mt: 2 }}>
							Перейти к покупкам
						</Button>
					</Link>
				</Box>
			)}
		</Container>
	)
}
