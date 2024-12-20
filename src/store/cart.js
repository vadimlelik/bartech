import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],
            addToCart: (product) => {
                const { cartItems } = get()
                const existingItem = cartItems.find((item) => item.id === product.id)

                if (existingItem) {
                    set({
                        cartItems: cartItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    })
                } else {
                    set({
                        cartItems: [...cartItems, { ...product, quantity: 1 }],
                    })
                }
            },
            removeFromCart: (productId) =>
                set((state) => ({
                    cartItems: state.cartItems.filter((item) => item.id !== productId),
                })),
            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    cartItems: state.cartItems.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                })),
            clearCart: () => set({ cartItems: [] }),
            getCartTotal: () => {
                const { cartItems } = get()
                return cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                )
            },
            getCartItemsCount: () => {
                const { cartItems } = get()
                return cartItems.reduce((total, item) => total + item.quantity, 0)
            },
        }),
        {
            name: 'cart-storage',
        }
    )
)
