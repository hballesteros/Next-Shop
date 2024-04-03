import { CartProduct } from '@/interfaces'
import { create } from 'zustand'


interface State {
  cart: CartProduct[]
  addProductToCart: (product: CartProduct) => void
  //updateProductQuantity: (productId: string, quantity: number) => void
  //removeProductFromCart: (productId: string) => void
}



export const useCartStore = create<State>(

  (set, get) => ({

    cart: [],

    // Methods
    addProductToCart: (product: CartProduct) => {

      const { cart } = get()

      // 1. Revisar si el producto ya está en el carrito con la talla seleccionada
      const productInCart = cart.some(
        (item) => (item.id === product.id && item.size === product.size)
      )

      if ( !productInCart ) {
        set({ cart: [...cart, product] })
        return
      }

      // 2. Si el producto ya está en el carrito, incrementar la cantidad
      const updatedCartProducts = cart.map((item) =>
        item.id === product.id && item.size === product.size
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      )

      set({ cart: updatedCartProducts })
    },


    // updateProductQuantity: (productId, quantity) =>
    //     set((state) => ({
    //         cart: state.cart.map((product) =>
    //             product.id === productId ? { ...product, quantity } : product
    //         ),
    //     })),
    // removeProductFromCart: (productId) => set((state) => ({ cart: state.cart.filter((product) => product.id !== productId) })),
  })
)
