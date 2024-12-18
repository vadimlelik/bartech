import { create } from 'zustand'

const getInitialCart = () => {
	if (typeof window === 'undefined') return []
	const savedCart = localStorage.getItem('cart')
	return savedCart ? JSON.parse(savedCart) : []
}

export const useCartStore = create((set, get) => ({
	cartItems: getInitialCart(),

	addToCart: (product) => {
		if (!product || !product._id) return

		set((state) => {
			const existingItem = state.cartItems.find(
				(item) => item._id === product._id
			)

			let updatedItems
			if (existingItem) {
				updatedItems = state.cartItems.map((item) =>
					item._id === product._id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			} else {
				updatedItems = [...state.cartItems, { ...product, quantity: 1 }]
			}

			if (typeof window !== 'undefined') {
				localStorage.setItem('cart', JSON.stringify(updatedItems))
			}
			return { cartItems: updatedItems }
		})
	},

	updateQuantity: (productId, quantity) => {
		if (quantity < 1) return
		set((state) => {
			const updatedItems = state.cartItems.map((item) =>
				item._id === productId ? { ...item, quantity } : item
			)
			if (typeof window !== 'undefined') {
				localStorage.setItem('cart', JSON.stringify(updatedItems))
			}
			return { cartItems: updatedItems }
		})
	},

	removeFromCart: (productId) => {
		set((state) => {
			const updatedItems = state.cartItems.filter(
				(item) => item._id !== productId
			)
			if (typeof window !== 'undefined') {
				localStorage.setItem('cart', JSON.stringify(updatedItems))
			}
			return { cartItems: updatedItems }
		})
	},

	getCartTotal: () => {
		return get().cartItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		)
	},

	clearCart: () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('cart')
		}
		set({ cartItems: [] })
	}
}))
