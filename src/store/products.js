import { create } from 'zustand'

export const useProductStore = create((set) => ({
  products: [],
  
  setProducts: (products) => set({ products }),
  
  getProductById: (id) => {
    const state = useProductStore.getState()
    return state.products.find(product => product.id === id)
  }
}))
