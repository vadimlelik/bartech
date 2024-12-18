'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
	Grid,
	Card,
	CardContent,
	Typography,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Stack,
	Pagination,
	Chip,
	IconButton,
	Snackbar,
	Button,
	Alert,
	Paper,
	Slide,
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useCompareStore } from '../../../store/compare'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useCartStore } from '../../../store/cart'
import { useFavoritesStore } from '../../../store/favorites'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const ITEMS_PER_PAGE = 12

export default function ProductList({ id }) {
	const [mounted, setMounted] = useState(false)
	const [loading, setLoading] = useState(false)
	const [products, setProducts] = useState([])
	const [totalPages, setTotalPages] = useState(0)
	const [snackbarOpen, setSnackbarOpen] = useState(false)
	const [snackbarMessage, setSnackbarMessage] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [sortBy, setSortBy] = useState('name')
	const [sortOrder, setSortOrder] = useState('asc')
	const [searchTerm, setSearchTerm] = useState('')
	const [filters, setFilters] = useState({})
	const [selectedFilters, setSelectedFilters] = useState({
		memory: '',
		ram: '',
		display: '',
		processor: '',
		color: '',
		condition: '',
		year: '',
		brand: '',
		model: '',
		os: '',
		battery: '',
		camera: '',
		storage: '',
	})

	const router = useRouter()
	const searchParams = useSearchParams()
	const { compareItems, addToCompare, removeFromCompare } = useCompareStore()
	const { cartItems, addToCart } = useCartStore()
	const { favorites, addToFavorites, removeFromFavorites, isInFavorites } =
		useFavoritesStore()

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (mounted) {
			const fetchProducts = async () => {
				setLoading(true)
				try {
					const page = searchParams.get('page') || 1
					setCurrentPage(Number(page))

					// Строим URL с параметрами
					const queryParams = new URLSearchParams({
						categoryId: id,
						page: page,
						sort: sortOrder,
						sortBy: sortBy,
						search: searchTerm,
					})

					// Добавляем все активные фильтры
					Object.entries(selectedFilters).forEach(([key, value]) => {
						if (value) queryParams.append(key, value)
					})

					const response = await fetch(`/api/products?${queryParams}`)
					if (!response.ok) throw new Error('Failed to fetch')

					const data = await response.json()
					console.log('Received filters:', data.filters) // Добавляем отладку
					setProducts(data.products || [])
					setFilters(data.filters || {})
					setTotalPages(Math.ceil((data.pagination?.total || 0) / ITEMS_PER_PAGE))
				} catch (error) {
					setSnackbarMessage('Ошибка при загрузке товаров')
					setSnackbarOpen(true)
				} finally {
					setLoading(false)
				}
			}

			fetchProducts()
		}
	}, [currentPage, sortBy, sortOrder, searchTerm, selectedFilters, mounted])

	if (!mounted) {
		return null
	}

	const handleAddToCart = (product) => {
		const productWithPrice = {
			...product,
			price: product.variants[0]?.price || 0,
			quantity: 1,
		}
		addToCart(productWithPrice)
		setSnackbarMessage('Товар добавлен в корзину')
		setSnackbarOpen(true)
	}

	const handleSnackbarClose = () => {
		setSnackbarOpen(false)
	}

	const handleCompareClick = () => {
		router.push('/compare')
	}

	const handleFavoriteClick = (product) => {
		if (!product || !product._id) {
			console.error('Invalid product:', product)
			return
		}

		if (isInFavorites(product._id)) {
			removeFromFavorites(product._id)
			setSnackbarMessage('Товар удален из закладок')
		} else {
			addToFavorites(product._id)
			setSnackbarMessage('Товар добавлен в закладки')
		}
		setSnackbarOpen(true)
	}

	const handleSortChange = (event) => {
		const [newSortBy, newSortOrder] = event.target.value.split('-')
		setSortBy(newSortBy)
		setSortOrder(newSortOrder)
	}

	const handleFilterChange = (filterName, value) => {
		setSelectedFilters((prev) => ({
			...prev,
			[filterName]: value,
		}))
	}

	const handleSearch = (event) => {
		setSearchTerm(event.target.value)
	}

	const handlePageChange = (event, value) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('page', value)
		router.push(`?${params.toString()}`)
	}

	const getFilterLabel = (filterName) => {
		const labels = {
			brand: 'Бренд',
			model: 'Модель',
			memory: 'Память',
			ram: 'Оперативная память',
			processor: 'Процессор',
			display: 'Дисплей',
			color: 'Цвет',
			condition: 'Состояние',
			os: 'Операционная система',
			battery: 'Аккумулятор',
			camera: 'Камера',
			storage: 'Количество памяти'
		}
		return (
			labels[filterName] ||
			filterName.charAt(0).toUpperCase() + filterName.slice(1)
		)
	}

	return (
		<Box sx={{ position: 'relative', minHeight: '100vh', pb: 10 }}>
			<Stack spacing={2} sx={{ mb: 4 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={3}>
						<Paper sx={{ p: 2, mb: 2 }}>
							<FormControl fullWidth sx={{ mb: 2 }}>
								<InputLabel>Сортировка</InputLabel>
								<Select
									value={`${sortBy}-${sortOrder}`}
									onChange={handleSortChange}
									label='Сортировка'
								>
									<MenuItem value='name-asc'>По названию (А-Я)</MenuItem>
									<MenuItem value='name-desc'>По названию (Я-А)</MenuItem>
									<MenuItem value='price-asc'>По цене (возрастание)</MenuItem>
									<MenuItem value='price-desc'>По цене (убывание)</MenuItem>
									<MenuItem value='year-desc'>По году (сначала новые)</MenuItem>
									<MenuItem value='year-asc'>По году (сначала старые)</MenuItem>
								</Select>
							</FormControl>

							<TextField
								fullWidth
								label='Поиск'
								value={searchTerm}
								onChange={handleSearch}
								sx={{ mb: 2 }}
							/>

							{/* Основные фильтры */}
							<Typography variant='subtitle1' sx={{ mb: 1 }}>
								Основные характеристики
							</Typography>
							{['brand', 'model', 'storage', 'memory', 'ram', 'processor'].map(
								(filterName) => {
									const values = filters[filterName + 's']
									console.log(`Filter ${filterName}:`, values) // Отладка
									return values && values.length > 0 ? (
										<FormControl key={filterName} fullWidth sx={{ mb: 2 }}>
											<InputLabel>{getFilterLabel(filterName)}</InputLabel>
											<Select
												value={selectedFilters[filterName] || ''}
												onChange={(e) =>
													handleFilterChange(filterName, e.target.value)
												}
												label={getFilterLabel(filterName)}
											>
												<MenuItem value=''>Все</MenuItem>
												{values.map((value) => (
													<MenuItem key={value} value={value}>
														{value}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									) : null
								}
							)}

							{/* Дополнительные фильтры */}
							<Typography variant='subtitle1' sx={{ mb: 1, mt: 2 }}>
								Дополнительные характеристики
							</Typography>
							{['display', 'camera', 'battery', 'os', 'color', 'condition', 'year'].map(
								(filterName) => {
									const values = filters[filterName + 's']
									console.log(`Filter ${filterName}:`, values) // Отладка
									return values && values.length > 0 ? (
										<FormControl key={filterName} fullWidth sx={{ mb: 2 }}>
											<InputLabel>{getFilterLabel(filterName)}</InputLabel>
											<Select
												value={selectedFilters[filterName] || ''}
												onChange={(e) =>
													handleFilterChange(filterName, e.target.value)
												}
												label={getFilterLabel(filterName)}
											>
												<MenuItem value=''>Все</MenuItem>
												{values.map((value) => (
													<MenuItem key={value} value={value}>
														{value}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									) : null
								}
							)}
						</Paper>
					</Grid>

					<Grid item xs={12} md={9}>
						<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
							{loading ? 'Loading...' : `Found: ${products.length} products`}
						</Typography>

						<Grid
							container
							spacing={2}
							sx={{ mt: 2, width: '100%', margin: '0 auto' }}
						>
							{products.map((product) => (
								<Grid
									item
									key={product._id}
									sx={{
										width: {
											xs: '100%', // На мобильных - одна карточка
											sm: '100%', // На планшетах - одна карточка
											md: 'calc(33.333% - 16px)', // На десктопах - три карточки
										},
										margin: '8px',
									}}
								>
									<Card
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											position: 'relative',
											transition: 'transform 0.2s, box-shadow 0.2s',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
											},
										}}
									>
										{/* Кнопки действий */}
										<Box
											sx={{
												position: 'absolute',
												top: 8,
												right: 8,
												display: 'flex',
												gap: '8px',
												zIndex: 2,
											}}
										>
											<IconButton
												size='small'
												sx={{
													backgroundColor: 'background.paper',
													boxShadow: 1,
													'&:hover': {
														backgroundColor: 'action.hover',
													},
													padding: '8px',
												}}
												onClick={(e) => {
													e.preventDefault()
													handleFavoriteClick(product)
												}}
												color={isInFavorites(product._id) ? 'error' : 'default'}
											>
												{isInFavorites(product._id) ? (
													<FavoriteIcon />
												) : (
													<FavoriteBorderIcon />
												)}
											</IconButton>
											<IconButton
												size='small'
												sx={{
													backgroundColor: 'background.paper',
													boxShadow: 1,
													'&:hover': {
														backgroundColor: 'action.hover',
													},
													padding: '8px',
												}}
												onClick={(e) => {
													e.preventDefault()
													if (compareItems.includes(product._id)) {
														removeFromCompare(product._id)
													} else {
														addToCompare(product._id)
													}
												}}
												color={
													compareItems.includes(product._id)
														? 'primary'
														: 'default'
												}
											>
												<CompareArrowsIcon />
											</IconButton>
										</Box>

										<Link
											href={`/products/${product._id}`}
											style={{
												textDecoration: 'none',
												color: 'inherit',
												display: 'flex',
												flexDirection: 'column',
												flexGrow: 1,
											}}
										>
											{/* Изображение товара */}
											<Box
												sx={{
													position: 'relative',
													width: '100%',
													pt: '100%', // Соотношение сторон 1:1
													backgroundColor: 'background.paper',
													borderRadius: '4px 4px 0 0',
													overflow: 'hidden',
												}}
											>
												<Box
													sx={{
														position: 'absolute',
														top: 0,
														left: 0,
														right: 0,
														bottom: 0,
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														p: 2,
													}}
												>
													<Image
														src={product.image || '/placeholder.jpg'}
														alt={product.name}
														fill
														style={{
															objectFit: 'contain',
															padding: '8px',
														}}
													/>
												</Box>
											</Box>

											{/* Информация о товаре */}
											<CardContent
												sx={{
													flexGrow: 1,
													display: 'flex',
													flexDirection: 'column',
													gap: 1,
													p: 2,
												}}
											>
												<Typography
													variant='h6'
													component='h2'
													sx={{
														fontSize: '1rem',
														fontWeight: 600,
														mb: 1,
														minHeight: '3rem',
														display: '-webkit-box',
														WebkitLineClamp: 2,
														WebkitBoxOrient: 'vertical',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													{product.name}
												</Typography>

												{/* Основные характеристики */}
												<Stack spacing={1} sx={{ mb: 2 }}>
													{product.specifications && (
														<>
															<Typography variant="body2" color="text.secondary">
																Процессор: {product.specifications.processor}
															</Typography>
															<Stack direction="row" spacing={1} flexWrap="wrap">
																<Chip
																	label={`${product.specifications.memory} память`}
																	size="small"
																	sx={{ 
																		fontSize: '0.75rem',
																		bgcolor: 'primary.main',
																		color: 'white'
																	}}
																/>
																<Chip
																	label={`${product.specifications.ram} ОЗУ`}
																	size="small"
																	sx={{ 
																		fontSize: '0.75rem',
																		bgcolor: 'secondary.main',
																		color: 'white'
																	}}
																/>
															</Stack>
															<Typography variant="body2" color="text.secondary">
																Экран: {product.specifications.display}
															</Typography>
															<Typography variant="body2" color="text.secondary">
																Камера: {product.specifications.camera}
															</Typography>
														</>
													)}
												</Stack>

												<Box sx={{ mt: 'auto', pt: 2 }}>
													<Typography
														variant='h5'
														component='p'
														sx={{
															fontWeight: 700,
															color: 'primary.main',
															display: 'flex',
															alignItems: 'center',
															gap: 1,
														}}
													>
														{product.variants[0]?.price
															? `${product.variants[0].price.toLocaleString()} ₽`
															: 'Цена по запросу'}
													</Typography>

													<Typography
														variant='body2'
														color='text.secondary'
														sx={{ mt: 0.5 }}
													>
														{product.variants.length}{' '}
														{product.variants.length === 1
															? 'вариант'
															: product.variants.length < 5
															? 'варианта'
															: 'вариантов'}
													</Typography>
												</Box>
											</CardContent>
										</Link>

										{/* Кнопка добавления в корзину */}
										<Box sx={{ p: 2, pt: 0 }}>
											<Button
												variant='contained'
												fullWidth
												onClick={(e) => {
													e.preventDefault()
													handleAddToCart(product)
												}}
												startIcon={<ShoppingCartIcon />}
												sx={{
													borderRadius: 2,
													textTransform: 'none',
													fontWeight: 600,
												}}
											>
												В корзину
											</Button>
										</Box>
									</Card>
								</Grid>
							))}
						</Grid>

						<Box
							sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}
						>
							<Pagination
								count={totalPages}
								page={currentPage}
								onChange={(event, value) => {
									const params = new URLSearchParams(searchParams.toString())
									params.set('page', value)
									router.push(`?${params.toString()}`)
								}}
								color='primary'
								size='large'
							/>
						</Box>
					</Grid>
				</Grid>
			</Stack>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity='success'
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>

			<Slide direction='up' in={compareItems.length >= 2}>
				<Paper
					elevation={4}
					sx={{
						position: 'fixed',
						bottom: 20,
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 1000,
						p: 2,
						borderRadius: 2,
						bgcolor: 'primary.main',
						color: 'white',
						display: 'flex',
						alignItems: 'center',
						gap: 2,
					}}
				>
					<Typography>
						Выбрано {compareItems.length} товара для сравнения
					</Typography>
					<Button
						variant='contained'
						color='secondary'
						onClick={handleCompareClick}
						startIcon={<CompareArrowsIcon />}
					>
						Сравнить
					</Button>
				</Paper>
			</Slide>
		</Box>
	)
}
