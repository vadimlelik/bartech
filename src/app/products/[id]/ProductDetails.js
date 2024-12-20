'use client'

import { useState } from 'react'
import {
	Box,
	Grid,
	Typography,
	Button,
	Tabs,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Paper,
	Dialog,
	DialogContent,
	IconButton,
	Slider,
	TextField,
	Stack,
	Chip,
	Rating,
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Divider,
} from '@mui/material'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useFavoritesStore } from '@/store/favorites'
import { useCompareStore } from '@/store/compare'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentIcon from '@mui/icons-material/Payment'
import ScheduleIcon from '@mui/icons-material/Schedule'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'

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

function InstallmentCalculator({ price }) {
	const [months, setMonths] = useState(12)
	const monthlyPayment = price / months

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h6' gutterBottom>
				Рассрочка на {months} месяцев
			</Typography>
			<Slider
				value={months}
				onChange={(_, value) => setMonths(value)}
				step={6}
				marks
				min={6}
				max={36}
				valueLabelDisplay='auto'
				sx={{ mt: 4, mb: 2 }}
			/>
			<Typography variant='h5' color='primary' sx={{ mt: 3 }}>
				Ежемесячный платеж: {Math.round(monthlyPayment).toLocaleString()} ₽
			</Typography>
			<Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
				Общая сумма: {price.toLocaleString()} ₽
			</Typography>
			<Button variant='contained' fullWidth sx={{ mt: 3 }}>
				Оформить рассрочку
			</Button>
		</Box>
	)
}

function Reviews() {
	const reviews = [
		{
			id: 1,
			author: 'Александр',
			rating: 5,
			date: '15.12.2023',
			text: 'Отличный телефон, всем рекомендую!',
		},
		{
			id: 2,
			author: 'Мария',
			rating: 4,
			date: '10.12.2023',
			text: 'Хороший телефон, но дороговато',
		},
		{
			id: 3,
			author: 'Дмитрий',
			rating: 5,
			date: '05.12.2023',
			text: 'Камера супер, батарея держит долго',
		},
	]

	return (
		<List>
			{reviews.map((review, index) => (
				<div key={review.id}>
					<ListItem alignItems='flex-start'>
						<ListItemAvatar>
							<Avatar>{review.author[0]}</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary={
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Typography component='span' variant='subtitle1'>
										{review.author}
									</Typography>
									<Typography
										component='span'
										variant='body2'
										color='text.secondary'
									>
										{review.date}
									</Typography>
								</Box>
							}
							secondary={
								<>
									<Rating
										value={review.rating}
										readOnly
										size='small'
										sx={{ mt: 1 }}
									/>
									<Typography
										component='span'
										variant='body2'
										color='text.primary'
										sx={{ display: 'block', mt: 1 }}
									>
										{review.text}
									</Typography>
								</>
							}
						/>
					</ListItem>
					{index < reviews.length - 1 && (
						<Divider variant='inset' component='li' />
					)}
				</div>
			))}
		</List>
	)
}

function Delivery() {
	return (
		<Box>
			<List>
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<LocalShippingIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary='Бесплатная доставка'
						secondary='При заказе от 5000 рублей'
					/>
				</ListItem>
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<PaymentIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary='Оплата при получении'
						secondary='Наличными или картой'
					/>
				</ListItem>
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<ScheduleIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary='Срок доставки' secondary='1-3 рабочих дня' />
				</ListItem>
				<ListItem>
					<ListItemAvatar>
						<Avatar>
							<LocationOnIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						primary='Пункты выдачи'
						secondary='Более 1000 пунктов выдачи по всей России'
					/>
				</ListItem>
			</List>
		</Box>
	)
}

export default function ProductDetails({ product }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [isImageDialogOpen, setImageDialogOpen] = useState(false)
	const [tabValue, setTabValue] = useState(0)
	const { addToCart } = useCartStore()
	const { favorites, addToFavorites, removeFromFavorites } = useFavoritesStore()
	const { addToCompare, isInCompare } = useCompareStore()
	const isFavorite = favorites.includes(product.id)

	const handleImageClick = () => {
		setImageDialogOpen(true)
	}

	const handlePrevImage = () => {
		setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 0))
	}

	const handleNextImage = () => {
		setCurrentImageIndex((prev) => (prev < 0 ? 0 : prev + 1))
	}

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
	}

	return (
		<Box>
			<Grid container spacing={4}>
				<Grid item xs={12} md={6}>
					<Box
						sx={{
							position: 'relative',
							width: '100%',
							height: '500px',
						}}
					>
						<Image
							src={product.image}
							alt={product.name}
							fill
							style={{ objectFit: 'contain' }}
							unoptimized
						/>
					</Box>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant='h4' gutterBottom>
						{product.name}
					</Typography>
					<Typography variant='h5' color='primary' gutterBottom>
						{(product.price * 3.35).toFixed(2)} BYN
					</Typography>
					<Typography variant='body1' color='text.secondary' paragraph>
						{product.description}
					</Typography>
					<Stack direction='row' spacing={2} sx={{ mb: 4 }}>
						<Button
							variant='contained'
							size='large'
							onClick={() => addToCart(product)}
							fullWidth
						>
							В корзину
						</Button>
						<IconButton
							onClick={() =>
								isFavorite
									? removeFromFavorites(product.id)
									: addToFavorites(product.id)
							}
							color={isFavorite ? 'error' : 'default'}
						>
							{isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>
						<IconButton
							onClick={() => {
								const success = addToCompare(product)
								if (!success) {
									alert('Можно сравнивать максимум 4 товара')
								}
							}}
							color={isInCompare(product.id) ? 'primary' : 'default'}
						>
							<CompareArrowsIcon />
						</IconButton>
					</Stack>
				</Grid>
			</Grid>

			<Box sx={{ mt: 6 }}>
				<Paper>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						variant='scrollable'
						scrollButtons='auto'
					>
						<Tab label='Характеристики' />
						<Tab label='Доставка' />
						<Tab label='Рассрочка' />
						<Tab label='Отзывы' />
					</Tabs>

					<TabPanel value={tabValue} index={0}>
						<TableContainer>
							<Table>
								<TableBody>
									{Object.entries(product.specifications).map(
										([key, value]) => (
											<TableRow key={key}>
												<TableCell
													component='th'
													scope='row'
													sx={{ width: '30%' }}
												>
													{key}
												</TableCell>
												<TableCell>{value}</TableCell>
											</TableRow>
										)
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</TabPanel>

					<TabPanel value={tabValue} index={1}>
						<Delivery />
					</TabPanel>

					<TabPanel value={tabValue} index={2}>
						<InstallmentCalculator price={product.price} />
					</TabPanel>

					<TabPanel value={tabValue} index={3}>
						<Reviews />
					</TabPanel>
				</Paper>
			</Box>

			<Dialog
				open={isImageDialogOpen}
				onClose={() => setImageDialogOpen(false)}
				maxWidth='xl'
				fullWidth
			>
				<DialogContent sx={{ position: 'relative', p: 0, height: '80vh' }}>
					<IconButton
						onClick={() => setImageDialogOpen(false)}
						sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
					>
						<CloseIcon />
					</IconButton>
					<IconButton
						onClick={handlePrevImage}
						sx={{
							position: 'absolute',
							left: 8,
							top: '50%',
							transform: 'translateY(-50%)',
						}}
					>
						<ArrowBackIcon />
					</IconButton>
					<IconButton
						onClick={handleNextImage}
						sx={{
							position: 'absolute',
							right: 8,
							top: '50%',
							transform: 'translateY(-50%)',
						}}
					>
						<ArrowForwardIcon />
					</IconButton>
					<Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
						<Image
							src={product.image}
							alt={product.name}
							fill
							style={{ objectFit: 'contain' }}
						/>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	)
}
