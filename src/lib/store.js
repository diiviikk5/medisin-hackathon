import { create } from 'zustand'

export const useStore = create((set, get) => ({
  cart: [],
  shameScore: 0,
  declines: 0,
addToCart: (product) => {
  console.log('🛒 Adding to cart:', product.name)
  set((state) => {
    const existing = state.cart.find((item) => item.product.id === product.id)
    if (existing) {
      console.log('📈 Updating existing item quantity')
      return {
        cart: state.cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }
    }
    console.log('✅ Adding new item to cart')
    const newCart = [...state.cart, { product, quantity: 1 }]
    console.log('🎮 New cart length:', newCart.length, '- Should trigger game!')
    return { cart: newCart }
  })
},
    
  removeFromCart: (productId) => {
    console.log('Removing from cart:', productId)
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    }))
  },

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: quantity > 0 
        ? state.cart.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        : state.cart.filter((item) => item.product.id !== productId)
    })),
    
  incrementShame: () => set((state) => ({ shameScore: state.shameScore + 1 })),
  incrementDeclines: () => set((state) => ({ declines: state.declines + 1 })),
  clearCart: () => set({ cart: [] }),
}))
