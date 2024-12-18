'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	Container,
	Paper,
	Typography,
	TextField,
	RadioGroup,
	FormControlLabel,
	Radio,
	Button,
	Box,
	Alert,
} from '@mui/material'
import { useCartStore } from '@/store/cart'

const phoneRegex = /^(\+375|375|80)?(29|25|44|33)(\d{3})(\d{2})(\d{2})$/

export default function CheckoutPage() {
	const { cartItems, getCartTotal, clearCart } = useCartStore()
	const [deliveryType, setDeliveryType] = useState('pickup')
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm()

	const onSubmit = async (data) => {
		// Подготовка данных для Bitrix24
		const bitrixData = {
			TITLE: 'Новый заказ с сайта',
			NAME: data.fullName,
			PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
			ADDRESS:
				deliveryType === 'delivery'
					? {
							CITY: data.city,
							STREET: data.street,
							HOUSE: data.house,
					  }
					: 'Самовывоз',
			COMMENTS: `Тип доставки: ${
				deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'
			}`,
			PRODUCTS: cartItems.map((item) => ({
				PRODUCT_NAME: item.name,
				PRICE: item.price,
				QUANTITY: item.quantity,
			})),
			TOTAL: getCartTotal(),
		}

		try {
			const response = await fetch('/api/create-order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(bitrixData),
			})

			if (response.ok) {
				clearCart()
				// Редирект на страницу успешного оформления
				window.location.href = '/order-success'
			} else {
				throw new Error('Failed to create order')
			}
		} catch (error) {
			console.error('Error creating order:', error)
			// Показать ошибку пользователю
		}
	}

	return (
		<Container maxWidth='md' sx={{ py: 4 }}>
			<Paper elevation={3} sx={{ p: 4 }}>
				<Typography variant='h4' gutterBottom>
					Оформление заказа
				</Typography>

				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						fullWidth
						label='ФИО'
						margin='normal'
						{...register('fullName', { required: 'ФИО обязательно' })}
						error={!!errors.fullName}
						helperText={errors.fullName?.message}
					/>

					<TextField
						fullWidth
						label='Телефон'
						margin='normal'
						{...register('phone', {
							required: 'Телефон обязателен',
							pattern: {
								value: phoneRegex,
								message: 'Введите корректный номер телефона для Беларуси',
							},
						})}
						error={!!errors.phone}
						helperText={errors.phone?.message}
					/>

					<RadioGroup
						value={deliveryType}
						onChange={(e) => setDeliveryType(e.target.value)}
						sx={{ my: 2 }}
					>
						<FormControlLabel
							value='pickup'
							control={<Radio />}
							label='Самовывоз'
						/>
						<FormControlLabel
							value='delivery'
							control={<Radio />}
							label='Доставка (Бесплатно)'
						/>
					</RadioGroup>

					{deliveryType === 'delivery' && (
						<Box sx={{ mt: 2 }}>
							<TextField
								fullWidth
								label='Город'
								margin='normal'
								{...register('city', {
									required: 'Город обязателен при доставке',
								})}
								error={!!errors.city}
								helperText={errors.city?.message}
							/>
							<TextField
								fullWidth
								label='Улица'
								margin='normal'
								{...register('street', {
									required: 'Улица обязательна при доставке',
								})}
								error={!!errors.street}
								helperText={errors.street?.message}
							/>
							<TextField
								fullWidth
								label='Дом'
								margin='normal'
								{...register('house', {
									required: 'Номер дома обязателен при доставке',
								})}
								error={!!errors.house}
								helperText={errors.house?.message}
							/>
						</Box>
					)}

					<Box sx={{ mt: 3 }}>
						<Typography variant='h6' gutterBottom>
							Итого к оплате: {getCartTotal().toLocaleString()} ₽
						</Typography>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							size='large'
							fullWidth
						>
							Оформить заказ
						</Button>
					</Box>
				</form>
			</Paper>
		</Container>
	)
}
