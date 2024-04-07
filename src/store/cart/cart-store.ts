import { CartProduct } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


/**
 * Represents the state of the cart store.
 */
interface State {
  cart: CartProduct[]
  getTotalItems: () => number
  getSummaryInformation: () => {
    totalItems: number;
    subTotalPrice: number;
    tax: number;
    totalPrice: number;
  }
  addProductToCart: (product: CartProduct) => void
  updateProductQuantity: (product: CartProduct, quantity: number) => void
  removeProductFromCart: (product: CartProduct) => void

  clearCart: () => void
}


/**
 * Custom hook for managing the cart state.
 *
 * @returns An object containing the cart state and methods for manipulating it.
 */
export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      // Methods

      /**
       * Get the total number of items in the cart.
       *
       * @returns The total number of items in the cart.
       */
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      /**
       * Get the summary information of the cart.
       */
      getSummaryInformation: () => {
        const { cart } = get();

        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const subTotalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const tax = subTotalPrice * 0.15;
        const totalPrice = subTotalPrice + tax;

        return { totalItems, subTotalPrice, tax, totalPrice };
      },

      /**
       * Add a product to the cart.
       *
       * @param product - The product to add to the cart.
       */
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // 1. Check if the product is already in the cart with the selected size
        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // 2. If the product is already in the cart, increment the quantity
        const updatedCartProducts = cart.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );

        set({ cart: updatedCartProducts });
      },

      /**
       * Update the quantity of a product in the cart.
       *
       * @param product - The product to update.
       * @param quantity - The new quantity of the product.
       */
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updatedCartProducts = cart.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity }
            : item
        );

        set({ cart: updatedCartProducts });
      },

      /**
       * Remove a product from the cart.
       *
       * @param product - The product to remove from the cart.
       */
      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get();

        const updatedCartProducts = cart.filter(
          (item) => !(item.id === product.id && item.size === product.size)
        );

        set({ cart: updatedCartProducts });
      },

      /**
       * Clear the cart.
       */
      clearCart: () => {
        set({ cart: [] });
      }

    }),
    {
      name: 'shopping-cart',
    }
  )
);

