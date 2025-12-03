import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      initialized: false,

      addToFavorites: (productId) => {
        if (!productId) return;
        const stringId = String(productId);
        const currentFavorites = get().favorites;
        if (!currentFavorites.includes(stringId)) {
          set((state) => ({
            favorites: [...state.favorites, stringId],
            initialized: true,
          }));
        }
      },

      removeFromFavorites: (productId) => {
        if (!productId) return;
        const stringId = String(productId);
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== stringId),
          initialized: true,
        }));
      },

      isInFavorites: (productId) => {
        if (!productId) return false;
        const stringId = String(productId);
        const state = get();
        return state.initialized && state.favorites.includes(stringId);
      },

      clearFavorites: () => {
        set({ favorites: [], initialized: true });
      },
    }),
    {
      name: 'favorites-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initialized = true;
        }
      },
    }
  )
);
