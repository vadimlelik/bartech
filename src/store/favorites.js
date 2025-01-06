import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useFavoritesStore = create(
	persist(
		(set, get) => ({
			favorites: [],
			initialized: false,

			addToFavorites: (productId) => {
				console.log('Adding to favorites:', productId) // Debug log
				if (!productId) return
				const currentFavorites = get().favorites
				if (!currentFavorites.includes(productId)) {
					set((state) => ({
						favorites: [...state.favorites, productId],
						initialized: true
					}))
					console.log('Updated favorites:', get().favorites) // Debug log
				}
			},

			removeFromFavorites: (productId) => {
				console.log('Removing from favorites:', productId) // Debug log
				if (!productId) return
				set((state) => ({
					favorites: state.favorites.filter((id) => id !== productId),
					initialized: true
				}))
				console.log('Updated favorites:', get().favorites) // Debug log
			},

			isInFavorites: (productId) => {
				if (!productId) return false
				const state = get()
				return state.initialized && state.favorites.includes(productId)
			},

			clearFavorites: () => {
				console.log('Clearing favorites') // Debug log
				set({ favorites: [], initialized: true })
			},
		}),
		{
			name: 'favorites-storage',
			version: 1,
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				console.log('Rehydrated state:', state) // Debug log
				if (state) {
					state.initialized = true
				}
			},
		}
	)
)
