import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCompareStore = create(
    persist(
        (set, get) => ({
            compareItems: [],
            addToCompare: (product) => {
                const { compareItems } = get();
                if (compareItems.length >= 4) {
                    return false;
                }
                if (!compareItems.find(item => item.id === product.id)) {
                    set({ compareItems: [...compareItems, product] });
                    return true;
                }
                return false;
            },
            removeFromCompare: (productId) =>
                set((state) => ({
                    compareItems: state.compareItems.filter((item) => item.id !== productId),
                })),
            clearCompare: () => set({ compareItems: [] }),
            isInCompare: (productId) => {
                const { compareItems } = get();
                return compareItems.some(item => item.id === productId);
            }
        }),
        {
            name: 'compare-storage',
        }
    )
);
