import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
	persist(
		(set, get) => ({
			favorites: [],

			addToFavorites: (productId) => {
				if (!productId) {
					return
				}

				const currentFavorites = get().favorites
				if (!currentFavorites.includes(productId)) {
					set((state) => ({
						favorites: [...state.favorites, productId],
					}))
				}
			},

			removeFromFavorites: (productId) => {
				if (!productId) {
					return
				}
				set((state) => ({
					favorites: state.favorites.filter((id) => id !== productId),
				}))
			},

			isInFavorites: (productId) => {
				if (!productId) {
					return false
				}
				const result = get().favorites.includes(productId)
				return result
			},

			clearFavorites: () => {
				set({ favorites: [] })
			},
		}),
		{
			name: 'favorites-storage',
			version: 2, // Увеличиваем версию для сброса старых данных
			getStorage: () => localStorage,
		}
	)
)
