'use client'

import { useState, useEffect } from 'react'
import {
	Box,
	Grid,
	Typography,
	Button,
	IconButton,
	Dialog,
	DialogContent,
	Snackbar,
	Alert,
	Tabs,
	Tab,
	Paper,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Card,
	CardContent,
	Divider,
	Slider,
	TextField,
	InputAdornment,
} from '@mui/material'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import InventoryIcon from '@mui/icons-material/Inventory'
import CloseIcon from '@mui/icons-material/Close'
import { useCartStore } from '../../../store/cart'
import { useFavoritesStore } from '../../../store/favorites'
import { useCompareStore } from '../../../store/compare'
import { formatPrice } from '../../../utils/formatPrice'

function TabPanel({ children, value, index, ...other }) {
	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`product-tabpanel-${index}`}
			aria-labelledby={`product-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	)
}

export default function ProductDetails({ product }) {
	const [selectedImage, setSelectedImage] = useState(null)
	const [openDialog, setOpenDialog] = useState(false)
	const [mounted, setMounted] = useState(false)
	const [openSnackbar, setOpenSnackbar] = useState(false)
	const [tabValue, setTabValue] = useState(0)
	const [installmentMonths, setInstallmentMonths] = useState(12)
	const [initialPayment, setInitialPayment] = useState(0)
	const { addToCart, removeFromCart, cartItems } = useCartStore()
	const { addToFavorites, removeFromFavorites, isInFavorites } =
		useFavoritesStore()
	const { addToCompare, removeFromCompare, isInCompare } = useCompareStore()

	console.log(product, 'product')

	const getProductPrice = () => {
		if (product.variants && product.variants.length > 0) {
			return product.variants[0].price
		}
		return product.price || 0
	}

	const productPrice = getProductPrice()

	// Преобразование характеристик продукта в массив для отображения
	const getProductSpecifications = () => {
		const specs = []
		
		// Добавляем все характеристики из объекта product
		if (product.specifications) {
			Object.entries(product.specifications).forEach(([key, value]) => {
				if (value) {
					specs.push({
						name: key,
						value: value
					})
				}
			})
		}

		// Добавляем основные характеристики, если они есть
		if (product.type) specs.push({ name: 'Тип оборудования', value: product.type })
		if (product.manufacturer) specs.push({ name: 'Производитель', value: product.manufacturer })
		if (product.country) specs.push({ name: 'Страна производства', value: product.country })
		if (product.sku) specs.push({ name: 'Артикул', value: product.sku })
		if (product.model) specs.push({ name: 'Модель', value: product.model })
		if (product.year) specs.push({ name: 'Год выпуска', value: product.year })
		if (product.power) specs.push({ name: 'Мощность двигателя', value: `${product.power} кВт` })
		if (product.dimensions) specs.push({ name: 'Габариты (Д×Ш×В)', value: product.dimensions })
		if (product.weight) specs.push({ name: 'Масса', value: `${product.weight} кг` })
		if (product.equipment) specs.push({ name: 'Комплект поставки', value: product.equipment })
		
		// Добавляем дополнительные характеристики из variants, если они есть
		if (product.variants && product.variants[0]) {
			const variant = product.variants[0]
			Object.entries(variant).forEach(([key, value]) => {
				if (value && !['price', 'id', '_id', 'productId'].includes(key)) {
					specs.push({
						name: key,
						value: value
					})
				}
			})
		}

		return specs
	}

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	const isProductInCart = cartItems.some(
		(item) => item._id === product._id || item.id === product._id
	)
	const isProductInFavorites = isInFavorites(product._id)
	const isProductInCompare = isInCompare(product._id)

	const handleImageClick = (image) => {
		setSelectedImage(image)
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
		setSelectedImage(null)
	}

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false)
	}

	const handleCartClick = () => {
		if (isProductInCart) {
			removeFromCart(product._id)
			setOpenSnackbar(true)
		} else {
			const productToAdd = {
				_id: product._id,
				name: product.name,
				price: productPrice,
				image: product.image,
				category: product.category,
				description: product.description,
				quantity: 1,
			}
			addToCart(productToAdd)
			setOpenSnackbar(true)
		}
	}

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
	}

	const handleInstallmentMonthsChange = (event, newValue) => {
		setInstallmentMonths(newValue)
	}

	const handleInitialPaymentChange = (event) => {
		const value = Math.min(
			Math.max(0, Number(event.target.value) || 0),
			productPrice
		)
		setInitialPayment(value)
	}

	const calculateMonthlyPayment = () => {
		if (!productPrice) return 0
		const remainingAmount = productPrice - initialPayment
		return Math.ceil(remainingAmount / installmentMonths)
	}

	return (
		<Grid container spacing={3}>
			<Grid item xs={12} md={6}>
				<Box
					sx={{
						position: 'relative',
						width: '100%',
						mb: 2,
						'.swiper': {
							width: '100%',
							height: '400px',
						},
						'.swiper-slide': {
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							background: '#f5f5f5',
							borderRadius: '8px',
							cursor: 'pointer',
						},
						'.swiper-button-next, .swiper-button-prev': {
							color: '#1976d2',
						},
						'.swiper-pagination-bullet-active': {
							background: '#1976d2',
						},
					}}
				>
					<Swiper
						modules={[Navigation, Pagination]}
						spaceBetween={30}
						slidesPerView={3}
						navigation
						pagination={{ clickable: true }}
						breakpoints={{
							320: {
								slidesPerView: 1,
								spaceBetween: 10
							},
							768: {
								slidesPerView: 2,
								spaceBetween: 20
							},
							1024: {
								slidesPerView: 3,
								spaceBetween: 30
							}
						}}
					>
						{[product.image, ...(product.additionalImages || [])].map(
							(image, index) => (
								<SwiperSlide
									key={index}
									onClick={() => handleImageClick(image)}
								>
									<Box
										sx={{
											position: 'relative',
											width: '100%',
											height: '400px',
										}}
									>
										<Image
											src={image || '/placeholder.jpg'}
											alt={`${product.name} - фото ${index + 1}`}
											layout='fill'
											objectFit='contain'
											quality={100}
											priority={index === 0}
										/>
									</Box>
								</SwiperSlide>
							)
						)}
					</Swiper>
				</Box>
			</Grid>

			<Grid item xs={12} md={6}>
				<Typography variant='h4' gutterBottom>
					{product.name}
				</Typography>

				<Box sx={{ mb: 3 }}>
					<Typography variant='h3' color='primary' gutterBottom>
						{formatPrice(productPrice)}
					</Typography>
					<Typography variant='h6' color='text.secondary'>
						Рассрочка от {formatPrice(Math.ceil(productPrice / 12))}/мес
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
					<Button
						variant={isProductInCart ? 'outlined' : 'contained'}
						color='primary'
						size='large'
						fullWidth
						onClick={handleCartClick}
					>
						{isProductInCart ? 'В корзине' : 'Добавить в корзину'}
					</Button>

					<IconButton
						onClick={() =>
							isProductInFavorites
								? removeFromFavorites(product._id)
								: addToFavorites(product)
						}
						color={isProductInFavorites ? 'error' : 'default'}
						title={
							isProductInFavorites
								? 'Убрать из избранного'
								: 'Добавить в избранное'
						}
					>
						{isProductInFavorites ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>

					<IconButton
						onClick={() =>
							isProductInCompare
								? removeFromCompare(product._id)
								: addToCompare(product)
						}
						color={isProductInCompare ? 'primary' : 'default'}
						title={
							isProductInCompare
								? 'Убрать из сравнения'
								: 'Добавить к сравнению'
						}
					>
						<CompareArrowsIcon />
					</IconButton>
				</Box>

				<Card variant='outlined' sx={{ mb: 3 }}>
					<CardContent>
						<Typography variant='subtitle1' color='primary' gutterBottom>
							Специальное предложение
						</Typography>
						<Typography variant='body2' paragraph>
							Купите сейчас в рассрочку без переплат на срок до 12 месяцев!
						</Typography>
						<Typography variant='body2' color='text.secondary' paragraph>
							* Калькулятор рассрочки работает в ознакомительных целях
						</Typography>

						<Box sx={{ mt: 2 }}>
							<Typography gutterBottom>Первоначальный взнос</Typography>
							<TextField
								fullWidth
								value={initialPayment === 0 ? '' : initialPayment}
								onChange={handleInitialPaymentChange}
								type='number'
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>₽</InputAdornment>
									),
								}}
								sx={{ mb: 2 }}
							/>

							<Typography gutterBottom>
								Срок рассрочки: {installmentMonths} мес.
							</Typography>
							<Slider
								value={installmentMonths}
								onChange={handleInstallmentMonthsChange}
								min={3}
								max={12}
								step={3}
								marks={[
									{ value: 3, label: '3 мес' },
									{ value: 6, label: '6 мес' },
									{ value: 9, label: '9 мес' },
									{ value: 12, label: '12 мес' },
								]}
								sx={{ mb: 2 }}
							/>

							<Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
								<Typography variant='body2' gutterBottom>
									Стоимость товара: {formatPrice(productPrice)}
								</Typography>
								<Typography variant='body2' gutterBottom>
									Первоначальный взнос: {formatPrice(initialPayment)}
								</Typography>
								<Typography variant='body2' gutterBottom>
									Срок рассрочки: {installmentMonths} месяцев
								</Typography>
								<Typography variant='subtitle1' color='primary'>
									Ежемесячный платеж: {formatPrice(calculateMonthlyPayment())}
								</Typography>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12}>
				<Paper sx={{ width: '100%', mt: 3 }}>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						variant='scrollable'
						scrollButtons='auto'
					>
						<Tab label='Описание' />
						<Tab label='Характеристики' />
						<Tab label='Доставка и оплата' />
						<Tab label='Отзывы' />
					</Tabs>

					<TabPanel value={tabValue} index={0}>
						<Box sx={{ 
							width: '100%',
							maxWidth: '100%',
							overflowX: 'hidden',
							'& img': {
								maxWidth: '100%',
								height: 'auto'
							}
						}}>
							<Typography variant='body1' paragraph>
								{product.description || 'Описание товара в процессе заполнения'}
							</Typography>
							<Typography variant='body1' paragraph>
								Преимущества:
							</Typography>
							<List>
								<ListItem>
									<ListItemIcon>
										<VerifiedUserIcon color='primary' />
									</ListItemIcon>
									<ListItemText
										primary='Надежность'
										secondary='Высокое качество сборки и материалов'
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<LocalShippingIcon color='primary' />
									</ListItemIcon>
									<ListItemText
										primary='Быстрая доставка'
										secondary='Доставим в любой регион'
									/>
								</ListItem>
								<ListItem>
									<ListItemIcon>
										<CreditCardIcon color='primary' />
									</ListItemIcon>
									<ListItemText
										primary='Удобная оплата'
										secondary='Любой способ оплаты'
									/>
								</ListItem>
							</List>
						</Box>
					</TabPanel>

					<TabPanel value={tabValue} index={1}>
						<List>
							{getProductSpecifications().map((spec, index) => (
								<ListItem key={index}>
									<ListItemText
										primary={spec.name}
										secondary={spec.value || 'Уточняется'}
									/>
								</ListItem>
							))}
							<ListItem>
								<ListItemText
									primary="Гарантия производителя"
									secondary="12 месяцев"
								/>
							</ListItem>
							<ListItem>
								<ListItemText
									primary="Сертификация"
									secondary="Товар сертифицирован"
								/>
							</ListItem>
						</List>
					</TabPanel>

					<TabPanel value={tabValue} index={2}>
						<List>
							<ListItem>
								<ListItemIcon>
									<LocalShippingIcon color='primary' />
								</ListItemIcon>
								<ListItemText
									primary='Доставка'
									secondary='Бесплатная доставка по Минску. Доставка в регионы согласно тарифам перевозчика.'
								/>
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<CreditCardIcon color='primary' />
								</ListItemIcon>
								<ListItemText
									primary='Способы оплаты'
									secondary='Наличный и безналичный расчет, банковские карты, рассрочка'
								/>
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<VerifiedUserIcon color='primary' />
								</ListItemIcon>
								<ListItemText
									primary='Гарантия'
									secondary='Гарантийное обслуживание 12 месяцев'
								/>
							</ListItem>
						</List>
					</TabPanel>

					<TabPanel value={tabValue} index={3}>
						<Typography variant='body1' color='text.secondary' align='center'>
							Отзывов пока нет. Станьте первым!
						</Typography>
					</TabPanel>
				</Paper>
			</Grid>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				maxWidth='xl'
				fullWidth
			>
				<DialogContent 
					sx={{ 
						p: 0, 
						position: 'relative', 
						height: '90vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						bgcolor: 'black'
					}}
				>
					<IconButton
						onClick={handleCloseDialog}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
							color: 'white',
							bgcolor: 'rgba(0,0,0,0.5)',
							'&:hover': {
								bgcolor: 'rgba(0,0,0,0.7)'
							}
						}}
					>
						<CloseIcon />
					</IconButton>
					{selectedImage && (
						<Box sx={{ 
							position: 'relative',
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
							<Image
								src={selectedImage}
								alt="Увеличенное изображение"
								layout="fill"
								objectFit="contain"
								quality={100}
							/>
						</Box>
					)}
				</DialogContent>
			</Dialog>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={isProductInCart ? 'success' : 'info'}
					sx={{ width: '100%' }}
				>
					{isProductInCart
						? 'Товар добавлен в корзину'
						: 'Товар удален из корзины'}
				</Alert>
			</Snackbar>
		</Grid>
	)
}
