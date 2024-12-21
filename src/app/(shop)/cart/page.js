'use client'

import { useState } from 'react'
import {
	Box,
	Container,
	Typography,
	Button,
	IconButton,
	Grid,
	Card,
	CardContent,
	TextField,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CartPage() {
	const router = useRouter()
	const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
		useCartStore()
	const [promoCode, setPromoCode] = useState('')

	const handleQuantityChange = (productId, newQuantity) => {
		if (newQuantity > 0) {
			updateQuantity(productId, newQuantity)
		}
	}

	const cartTotal = getCartTotal()

	if (!cartItems.length) {
		return (
			<>
				<Header />
				<Box
					sx={{
						minHeight: 'calc(100vh - 64px - 200px)', // Adjust based on your header and footer heights
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
								Корзина пуста
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
				<Footer />
			</>
		)
	}

	return (
		<>
			<Header />

			<Box
				sx={{
					minHeight: 'calc(100vh - 64px - 200px)', // Adjust based on your header and footer heights
					display: 'flex',
					flexDirection: 'column',
					py: 4,
				}}
			>
				<Container maxWidth='lg'>
					<Typography variant='h4' gutterBottom>
						Корзина
					</Typography>

					<Grid container spacing={4}>
						<Grid item xs={12} md={8}>
							<TableContainer component={Paper}>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Товар</TableCell>
											<TableCell align='right'>Цена</TableCell>
											<TableCell align='center'>Количество</TableCell>
											<TableCell align='right'>Сумма</TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{cartItems.map((item) => {
											const itemTotal = item.price * item.quantity

											return (
												<TableRow key={item.id}>
													<TableCell>
														<Box sx={{ display: 'flex', alignItems: 'center' }}>
															<Box
																sx={{
																	position: 'relative',
																	width: 80,
																	height: 80,
																	mr: 2,
																}}
															>
																<Image
																	src={item.image}
																	alt={item.name}
																	fill
																	style={{ objectFit: 'contain' }}
																	unoptimized
																/>
															</Box>
															<Link
																href={`/products/${item.id}`}
																style={{
																	textDecoration: 'none',
																	color: 'inherit',
																}}
															>
																<Typography variant='subtitle1'>
																	{item.name}
																</Typography>
															</Link>
														</Box>
													</TableCell>
													<TableCell align='right'>
														<Typography variant='body1'>
															{item.price.toFixed(2)} BYN
														</Typography>
													</TableCell>
													<TableCell align='center'>
														<Box
															sx={{
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
															}}
														>
															<IconButton
																size='small'
																onClick={() =>
																	handleQuantityChange(
																		item.id,
																		item.quantity - 1
																	)
																}
															>
																<RemoveIcon />
															</IconButton>
															<Typography sx={{ mx: 2 }}>
																{item.quantity}
															</Typography>
															<IconButton
																size='small'
																onClick={() =>
																	handleQuantityChange(
																		item.id,
																		item.quantity + 1
																	)
																}
															>
																<AddIcon />
															</IconButton>
														</Box>
													</TableCell>
													<TableCell align='right'>
														<Typography variant='body1'>
															{itemTotal.toFixed(2)} BYN
														</Typography>
													</TableCell>
													<TableCell>
														<IconButton
															onClick={() => removeFromCart(item.id)}
															color='error'
														>
															<DeleteIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											)
										})}
									</TableBody>
								</Table>
							</TableContainer>

							<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
								<Button
									variant='outlined'
									color='error'
									onClick={clearCart}
									startIcon={<DeleteIcon />}
								>
									Очистить корзину
								</Button>
							</Box>
						</Grid>

						<Grid item xs={12} md={4}>
							<Card>
								<CardContent>
									<Typography variant='h6' gutterBottom>
										Итого
									</Typography>
									<Box sx={{ mb: 3 }}>
										<TextField
											fullWidth
											label='Промокод'
											value={promoCode}
											onChange={(e) => setPromoCode(e.target.value)}
											size='small'
										/>
									</Box>
									<Divider sx={{ my: 2 }} />
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											mb: 2,
										}}
									>
										<Typography>Товары ({cartItems.length}):</Typography>
										<Box sx={{ textAlign: 'right' }}>
											<Typography variant='h6'>
												{cartTotal.toFixed(2)} BYN
											</Typography>
										</Box>
									</Box>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											mb: 2,
										}}
									>
										<Typography>Доставка:</Typography>
										<Typography>Бесплатно</Typography>
									</Box>
									<Divider sx={{ my: 2 }} />
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											mb: 3,
										}}
									>
										<Typography variant='h6'>К оплате:</Typography>
										<Box sx={{ textAlign: 'right' }}>
											<Typography variant='h6'>
												{cartTotal.toFixed(2)} BYN
											</Typography>
										</Box>
									</Box>
									<Button
										variant='contained'
										fullWidth
										size='large'
										onClick={() => router.push('/checkout')}
									>
										Оформить заказ
									</Button>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Container>
			</Box>
			<Footer />
		</>
	)
}
