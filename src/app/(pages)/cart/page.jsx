import { Box, Typography, Button, TextField } from '@mui/material'
import { useCartStore } from './index'
import { useForm } from 'react-hook-form'
import axios from 'axios'

export default function Cart() {
	const { cart, clearCart } = useCartStore()
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm()

	const onSubmit = async (data) => {
		try {
			await axios.post('/api/submit-order', { ...data, cart })
			clearCart()
			alert('Заявка отправлена!')
		} catch (error) {
			console.error(error)
			alert('Ошибка при отправке заявки.')
		}
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' gutterBottom>
				Корзина
			</Typography>

			{cart.length === 0 ? (
				<Typography>Корзина пуста.</Typography>
			) : (
				<Box>
					{cart.map((item, index) => (
						<Typography key={index}>{item.name}</Typography>
					))}

					<form onSubmit={handleSubmit(onSubmit)}>
						<TextField
							label='Ваше имя'
							{...register('name', { required: 'Имя обязательно' })}
							fullWidth
							margin='normal'
							error={!!errors.name}
							helperText={errors.name?.message}
						/>
						<TextField
							label='Телефон'
							{...register('phone', {
								required: 'Телефон обязателен',
								pattern: {
									value: /^\+375\d{9}$/,
									message: 'Введите корректный номер телефона (+375XXXXXXXXX)',
								},
							})}
							fullWidth
							margin='normal'
							error={!!errors.phone}
							helperText={errors.phone?.message}
						/>

						<Button type='submit' variant='contained' color='primary'>
							Отправить заявку
						</Button>
					</form>
				</Box>
			)}
		</Box>
	)
}
