'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
	Container,
	Typography,
	Card,
	CardContent,
	CardMedia,
	Button,
	IconButton,
	Box,
	Grid,
	Divider,
	Paper,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useCartStore } from '@/store/cart'
import Image from 'next/image'
import { formatPrice } from '../../utils/formatPrice'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Cart() {
	const { cartItems, updateQuantity, removeFromCart, getCartTotal } =
		useCartStore()
	const [mounted, setMounted] = useState(false)
	const [localCartItems, setLocalCartItems] = useState([])

	useEffect(() => {
		setMounted(true)
		setLocalCartItems(cartItems)
	}, [cartItems])

	if (!mounted) {
		return null
	}

	if (localCartItems.length === 0) {
		return (
			<div
				style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
			>
				<Header />
				<Container
					maxWidth='md'
					sx={{ mt: 4, textAlign: 'center', flexGrow: 1 }}
				>
					<Paper elevation={3} sx={{ p: 4 }}>
						<ShoppingCartIcon sx={{ fontSize: 60, color: 'grey.500', mb: 2 }} />
						<Typography variant='h5' gutterBottom>
							Корзина пуста
						</Typography>
						<Button
							component={Link}
							href='/'
							variant='contained'
							startIcon={<ArrowBackIcon />}
							sx={{ mt: 2 }}
						>
							Продолжить покупки
						</Button>
					</Paper>
				</Container>
				<Footer />
			</div>
		)
	}

	const totalPrice = getCartTotal()

	return (
		<>
			<Header />
			<Container maxWidth='lg' sx={{ mt: 4 }}>
				<Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
					Корзина
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<List>
							{localCartItems.map((item) => {
								const itemId = item._id || item.id
								const totalItemPrice = item.price * item.quantity

								return (
									<Card key={itemId} sx={{ mb: 2 }}>
										<Grid container>
											<Grid item xs={12} sm={4}>
												<CardMedia
													component='img'
													height='200'
													image={item.image}
													alt={item.name}
													sx={{ objectFit: 'contain' }}
												/>
											</Grid>
											<Grid item xs={12} sm={8}>
												<CardContent>
													<Link
														href={`/products/${itemId}`}
														style={{
															textDecoration: 'none',
															color: 'inherit',
														}}
													>
														<Typography
															variant='h6'
															component='div'
															gutterBottom
														>
															{item.name}
														</Typography>
													</Link>

													<Typography
														variant='body2'
														color='text.secondary'
														sx={{ mb: 2 }}
													>
														{item.description}
													</Typography>

													<Box sx={{ mb: 2 }}>
														<Typography variant='h6' color='primary'>
															{formatPrice(item.price)} ₽
														</Typography>
														<Typography variant='body2' color='text.secondary'>
															Рассрочка от{' '}
															{formatPrice(Math.ceil(item.price / 12))}/мес
														</Typography>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
														}}
													>
														<Box sx={{ display: 'flex', alignItems: 'center' }}>
															<IconButton
																onClick={() =>
																	updateQuantity(
																		itemId,
																		Math.max(1, item.quantity - 1)
																	)
																}
																size='small'
															>
																<RemoveIcon />
															</IconButton>
															<Typography sx={{ mx: 2 }}>
																{item.quantity}
															</Typography>
															<IconButton
																onClick={() =>
																	updateQuantity(itemId, item.quantity + 1)
																}
																size='small'
															>
																<AddIcon />
															</IconButton>
														</Box>

														<Box sx={{ display: 'flex', alignItems: 'center' }}>
															<Typography variant='body1'>
																{formatPrice(item.price * item.quantity)}
															</Typography>
															<IconButton
																onClick={() => removeFromCart(itemId)}
																color='error'
															>
																<DeleteIcon />
															</IconButton>
														</Box>
													</Box>
												</CardContent>
											</Grid>
										</Grid>
									</Card>
								)
							})}
						</List>
					</Grid>
					<Grid item xs={12} md={4}>
						<Paper elevation={3} sx={{ p: 3 }}>
							<Typography variant='h6' gutterBottom>
								Итого
							</Typography>
							<Divider sx={{ my: 2 }} />
							<Typography variant='h6'>
								Итого: {formatPrice(totalPrice)}
							</Typography>
							<Button
								component={Link}
								href='/checkout'
								variant='contained'
								color='primary'
								fullWidth
								sx={{ mt: 3 }}
								size='large'
							>
								Оформить заказ
							</Button>
						</Paper>
					</Grid>
				</Grid>
				<Footer />
			</Container>
		</>
	)
}
