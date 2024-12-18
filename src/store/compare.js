import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCompareStore = create(
    persist(
        (set, get) => ({
            compareItems: [],

            addToCompare: (productId) => {
                set((state) => {
                    if (state.compareItems.length >= 3) {
                        return state
                    }
                    if (!state.compareItems.includes(productId)) {
                        return {
                            compareItems: [...state.compareItems, productId]
                        }
                    }
                    return state
                })
            },

            removeFromCompare: (productId) => {
                set((state) => ({
                    compareItems: state.compareItems.filter(id => id !== productId)
                }))
            },

            isInCompare: (productId) => {
                return get().compareItems.includes(productId)
            },

            clearCompare: () => {
                set({ compareItems: [] })
            }
        }),
        {
            name: 'compare-storage'
        }
    )
)
