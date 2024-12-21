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
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
				params.set('ids', favorites.join(','))

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
					.map((id) => data.products.find((p) => p.id === id))
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
		addToCart(product)
		setSnackbarMessage('Товар добавлен в корзину')
		setSnackbarOpen(true)
	}

	// Не рендерим ничего до монтирования компонента
	if (!mounted) {
		return null
	}

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: 'calc(100vh - 64px - 200px)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress />
			</Box>
		)
	}

	if (!products || products.length === 0) {
		return (
			<Box
				sx={{
					minHeight: 'calc(100vh - 64px - 200px)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					py: 8,
				}}
			>
				<Container maxWidth='lg'>
					<Box sx={{ textAlign: 'center' }}>
						<Typography variant='h4' gutterBottom>
							Список избранного пуст
						</Typography>
						<Button
							component={Link}
							href='/'
							variant='contained'
							color='primary'
							sx={{ mt: 2 }}
						>
							Вернуться к покупкам
						</Button>
					</Box>
				</Container>
			</Box>
		)
	}

	return (
		<>
			<Header />
			<Box
				sx={{
					minHeight: 'calc(100vh - 64px - 200px)',
					display: 'flex',
					flexDirection: 'column',
					py: 4,
				}}
			>
				<Container maxWidth='lg'>
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

					<Grid container spacing={2}>
						{products.map((product) => (
							<Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
								<Card>
									<Box
										sx={{
											position: 'relative',
											width: '100%',
											pt: '100%',
										}}
									>
										<Link href={`/products/${product.id}`}>
											<Image
												src={product.image}
												alt={product.name}
												fill
												style={{
													objectFit: 'contain',
													padding: '20px',
												}}
											/>
										</Link>
									</Box>
									<CardContent>
										<Link
											href={`/products/${product.id}`}
											style={{ textDecoration: 'none', color: 'inherit' }}
										>
											<Typography
												gutterBottom
												variant='h6'
												component='h2'
												sx={{
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													minHeight: '3.6em',
												}}
											>
												{product.name}
											</Typography>
										</Link>
										<Typography
											variant='h5'
											color='primary'
											sx={{ fontWeight: 'bold', mb: 2 }}
										>
											{product.price.toFixed(2)} BYN
										</Typography>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'space-between',
												gap: 1,
											}}
										>
											<Button
												variant='contained'
												onClick={() => handleAddToCart(product)}
												fullWidth
											>
												В корзину
											</Button>
											<IconButton
												onClick={() => removeFromFavorites(product.id)}
												color='error'
											>
												<DeleteIcon />
											</IconButton>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
			<Footer />
		</>
	)
}
