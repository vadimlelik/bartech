import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { reconcileCartItems } from '@/entities/cart/lib/reconcile-cart';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],
            citySlug: 'minsk',
            cityNotices: [],
            addToCart: (product, citySlug) => {
                const { cartItems, citySlug: currentCity } = get();
                const nextCity = citySlug || currentCity || 'minsk';
                const existingItem = cartItems.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        citySlug: nextCity,
                        cartItems: cartItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        citySlug: nextCity,
                        cartItems: [...cartItems, { ...product, quantity: 1, unavailable: false }],
                    });
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
            clearCart: () => set({ cartItems: [], cityNotices: [] }),
            clearCityNotices: () => set({ cityNotices: [] }),
            applyCityCatalog: (citySlug, products) => {
                const { cartItems } = get();
                const { items, notices } = reconcileCartItems(cartItems, products);
                set({
                    cartItems: items,
                    citySlug: citySlug || get().citySlug,
                    cityNotices: notices,
                });
                return notices;
            },
            getCartTotal: () => {
                const { cartItems } = get();
                return cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
            getCartItemsCount: () => {
                const { cartItems } = get();
                return cartItems.reduce((total, item) => total + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
