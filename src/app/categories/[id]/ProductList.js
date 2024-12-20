'use client'

import { useState, useEffect, useMemo } from 'react'
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
	Drawer,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Divider,
	CircularProgress,
	Skeleton,
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { useCompareStore } from '../../../store/compare'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FilterListIcon from '@mui/icons-material/FilterList'
import TuneIcon from '@mui/icons-material/Tune'

export default function ProductList({ categoryId }) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [sortBy, setSortBy] = useState('name')
	const [sort, setSort] = useState('asc')
	const [page, setPage] = useState(1)
	const [searchTerm, setSearchTerm] = useState('')
	const [totalPages, setTotalPages] = useState(1)
	const { compareItems, addToCompare, removeFromCompare } = useCompareStore()
	const [snackbarOpen, setSnackbarOpen] = useState(false)
	const [snackbarMessage, setSnackbarMessage] = useState('')
	const [favorites, setFavorites] = useState([])
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [availableFilters, setAvailableFilters] = useState({})
	const [activeFilters, setActiveFilters] = useState({})
	const [previewFilters, setPreviewFilters] = useState({})
	const [previewCount, setPreviewCount] = useState(null)
	const [isPreviewLoading, setIsPreviewLoading] = useState(false)

	useEffect(() => {
		const savedFavorites = localStorage.getItem('favorites')
		if (savedFavorites) {
			setFavorites(JSON.parse(savedFavorites))
		}
	}, [])

	const toggleFavorite = (productId) => {
		const newFavorites = favorites.includes(productId)
			? favorites.filter((id) => id !== productId)
			: [...favorites, productId]
		setFavorites(newFavorites)
		localStorage.setItem('favorites', JSON.stringify(newFavorites))
	}

	const handleSortChange = (event) => {
		setSortBy(event.target.value)
		setPage(1)
		updateUrl({ sortBy: event.target.value })
	}

	const handleOrderChange = (event) => {
		setSort(event.target.value)
		setPage(1)
		updateUrl({ sort: event.target.value })
	}

	const handlePageChange = (event, value) => {
		setPage(value)
		updateUrl({ page: value })
	}

	const handleSearch = (event) => {
		setSearchTerm(event.target.value)
		setPage(1)
		updateUrl({ search: event.target.value, page: 1 })
	}

	const handleFilterChange = async (field, value) => {
		const newFilters = { ...previewFilters }
		if (newFilters[field] === value) {
			delete newFilters[field]
		} else {
			newFilters[field] = value
		}
		setPreviewFilters(newFilters)

		// Получаем предварительный подсчет
		setIsPreviewLoading(true)
		try {
			const params = new URLSearchParams({
				categoryId,
				...newFilters,
			})
			const response = await fetch(`/api/products?${params}`)
			const data = await response.json()
			setPreviewCount(data.pagination.total)
		} catch (error) {
			console.error('Error fetching preview count:', error)
		}
		setIsPreviewLoading(false)
	}

	const applyFilters = () => {
		setActiveFilters(previewFilters)
		setPage(1)
		updateUrl({ ...previewFilters, page: 1 })
		setDrawerOpen(false)
	}

	const resetFilters = () => {
		setPreviewFilters({})
		setActiveFilters({})
		setPreviewCount(null)
		updateUrl({ page: 1 })
	}

	const updateUrl = (params) => {
		const currentParams = new URLSearchParams(searchParams.toString())
		Object.entries(params).forEach(([key, value]) => {
			if (value) {
				currentParams.set(key, value)
			} else {
				currentParams.delete(key)
			}
		})
		router.push(`?${currentParams.toString()}`)
	}

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true)
				console.log('Fetching products with categoryId:', categoryId)
				const params = new URLSearchParams({
					categoryId,
					sort,
					sortBy,
					page: page.toString(),
					search: searchTerm,
					...activeFilters,
				})
				console.log('Request URL:', `/api/products?${params}`)
				const response = await fetch(`/api/products?${params}`)
				if (!response.ok) {
					throw new Error('Не удалось загрузить продукты')
				}
				const data = await response.json()
				console.log('Received data:', data)
				setProducts(data.products)
				setTotalPages(data.pagination.pages)
				setAvailableFilters(data.filters)
			} catch (err) {
				console.error('Error fetching products:', err)
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		if (categoryId) {
			fetchProducts()
		}
	}, [categoryId, sort, sortBy, page, searchTerm, activeFilters])

	const handleCompareToggle = (product) => {
		if (compareItems.some((item) => item.id === product.id)) {
			removeFromCompare(product.id)
			setSnackbarMessage('Товар удален из сравнения')
		} else {
			if (compareItems.length >= 4) {
				setSnackbarMessage('Можно сравнивать максимум 4 товара')
			} else {
				addToCompare(product)
				setSnackbarMessage('Товар добавлен к сравнению')
			}
		}
		setSnackbarOpen(true)
	}

	const filterSections = [
		{ key: 'memory', label: 'Память' },
		{ key: 'ram', label: 'Оперативная память' },
		{ key: 'processor', label: 'Процессор' },
		{ key: 'display', label: 'Дисплей' },
		{ key: 'camera', label: 'Камера' },
		{ key: 'battery', label: 'Аккумулятор' },
		{ key: 'os', label: 'Операционная система' },
		{ key: 'color', label: 'Цвет' },
		{ key: 'year', label: 'Год выпуска' },
	]

	const ProductSkeleton = () => (
		<Grid item xs={12} sm={6} md={4}>
			<Card sx={{ height: '100%' }}>
				<Skeleton variant='rectangular' height={300} />
				<CardContent>
					<Skeleton variant='text' height={40} />
					<Skeleton variant='text' height={30} />
					<Stack direction='row' spacing={1} sx={{ mt: 2 }}>
						<Skeleton variant='rectangular' width='60%' height={40} />
						<Skeleton variant='circular' width={40} height={40} />
						<Skeleton variant='circular' width={40} height={40} />
					</Stack>
				</CardContent>
			</Card>
		</Grid>
	)

	if (error) {
		return (
			<Box sx={{ textAlign: 'center', py: 4 }}>
				<Typography color='error'>{error}</Typography>
			</Box>
		)
	}

	return (
		<>
			<Paper elevation={3} sx={{ p: 2, mb: 3 }}>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					alignItems='center'
				>
					<TextField
						label='Поиск'
						variant='outlined'
						value={searchTerm}
						onChange={handleSearch}
						sx={{ flexGrow: 1 }}
					/>
					<FormControl sx={{ minWidth: 120 }}>
						<InputLabel>Сортировать по</InputLabel>
						<Select
							value={sortBy}
							onChange={handleSortChange}
							label='Сортировать по'
						>
							<MenuItem value='name'>Названию</MenuItem>
							<MenuItem value='price'>Цене</MenuItem>
						</Select>
					</FormControl>
					<FormControl sx={{ minWidth: 120 }}>
						<InputLabel>Порядок</InputLabel>
						<Select value={sort} onChange={handleOrderChange} label='Порядок'>
							<MenuItem value='asc'>По возрастанию</MenuItem>
							<MenuItem value='desc'>По убыванию</MenuItem>
						</Select>
					</FormControl>
					<Button
						variant='outlined'
						startIcon={<TuneIcon />}
						onClick={() => setDrawerOpen(true)}
						color={
							Object.keys(activeFilters).length > 0 ? 'primary' : 'inherit'
						}
					>
						Фильтры
						{Object.keys(activeFilters).length > 0 && (
							<Chip
								label={Object.keys(activeFilters).length}
								size='small'
								color='primary'
								sx={{ ml: 1 }}
							/>
						)}
					</Button>
				</Stack>
			</Paper>

			<Drawer
				anchor='right'
				open={drawerOpen}
				onClose={() => {
					setPreviewFilters(activeFilters)
					setPreviewCount(null)
					setDrawerOpen(false)
				}}
				PaperProps={{
					sx: { width: { xs: '100%', sm: 400 } },
				}}
			>
				<Box sx={{ p: 2 }}>
					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'
						sx={{ mb: 2 }}
					>
						<Typography variant='h6'>Фильтры</Typography>
						{Object.keys(previewFilters).length > 0 && (
							<Button variant='text' onClick={resetFilters}>
								Сбросить все
							</Button>
						)}
					</Stack>
					<Divider sx={{ mb: 2 }} />
					<List>
						{filterSections.map(
							({ key, label }) =>
								availableFilters[key]?.length > 0 && (
									<ListItem
										key={key}
										sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
									>
										<Typography variant='subtitle1' sx={{ mb: 1 }}>
											{label}
										</Typography>
										<FormGroup>
											{availableFilters[key].map((value) => (
												<FormControlLabel
													key={value}
													control={
														<Checkbox
															checked={previewFilters[key] === value}
															onChange={() => handleFilterChange(key, value)}
														/>
													}
													label={value}
												/>
											))}
										</FormGroup>
										<Divider sx={{ my: 2, width: '100%' }} />
									</ListItem>
								)
						)}
					</List>
					{(previewCount !== null || isPreviewLoading) && (
						<Paper
							elevation={3}
							sx={{
								p: 2,
								position: 'sticky',
								bottom: 16,
								mt: 2,
								backgroundColor: 'background.paper',
								zIndex: 1,
							}}
						>
							<Stack spacing={2}>
								{isPreviewLoading ? (
									<Box sx={{ display: 'flex', justifyContent: 'center' }}>
										<CircularProgress size={24} />
									</Box>
								) : (
									<Typography>Найдено товаров: {previewCount}</Typography>
								)}
								<Button
									variant='contained'
									onClick={applyFilters}
									disabled={isPreviewLoading}
									fullWidth
								>
									Показать результаты
								</Button>
							</Stack>
						</Paper>
					)}
				</Box>
			</Drawer>

			<Grid container spacing={3}>
				{loading
					? Array.from(new Array(6)).map((_, index) => (
							<ProductSkeleton key={index} />
					  ))
					: products.map((product) => (
							<Grid item xs={12} sm={6} md={4} key={product.id}>
								<Card
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										position: 'relative',
									}}
								>
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
									<CardContent
										sx={{
											flexGrow: 1,
											display: 'flex',
											flexDirection: 'column',
										}}
									>
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
													textDecoration: 'none',
												}}
											>
												{product.name}
											</Typography>
										</Link>
										<Typography
											variant='h5'
											color='primary'
											sx={{ mt: 'auto', mb: 2, fontWeight: 'bold' }}
										>
											{product.price.toLocaleString()} BYN
										</Typography>
										<Stack
											direction='row'
											spacing={1}
											alignItems='center'
											justifyContent='space-between'
										>
											<Button
												variant='contained'
												component={Link}
												href={`/products/${product.id}`}
												fullWidth
											>
												Подробнее
											</Button>
											<IconButton
												onClick={() => handleCompareToggle(product)}
												color={
													compareItems.some((item) => item.id === product.id)
														? 'primary'
														: 'default'
												}
											>
												<CompareArrowsIcon />
											</IconButton>
											<IconButton
												onClick={() => toggleFavorite(product.id)}
												color={
													favorites.includes(product.id) ? 'error' : 'default'
												}
											>
												{favorites.includes(product.id) ? (
													<FavoriteIcon />
												) : (
													<FavoriteBorderIcon />
												)}
											</IconButton>
										</Stack>
									</CardContent>
								</Card>
							</Grid>
					  ))}
			</Grid>

			{totalPages > 1 && (
				<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
					<Pagination
						count={totalPages}
						page={page}
						onChange={handlePageChange}
						color='primary'
					/>
				</Box>
			)}

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={() => setSnackbarOpen(false)}
				TransitionComponent={Slide}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setSnackbarOpen(false)}
					severity='success'
					variant='filled'
					sx={{ width: '100%' }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	)
}
