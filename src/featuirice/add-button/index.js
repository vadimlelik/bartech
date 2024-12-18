'use client'

import { useCartStore } from '@/store/cart'
import { Button } from '@mui/material'

export default function CartButton({ phone }) {
	const { addToCart } = useCartStore()

	return (
		<Button
			variant='contained'
			color='primary'
			onClick={() => addToCart(phone)}
		>
			Добавить в корзину
		</Button>
	)
}
