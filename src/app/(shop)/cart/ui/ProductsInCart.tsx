'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { useCartStore } from "@/store"
import { QuantitySelector } from '@/components'
import Link from 'next/link'

/**
 * Renders the list of products in the cart.
 * @returns JSX element
 */
export const ProductsInCart = () => {

  const updateProductQuantity = useCartStore( state => state.updateProductQuantity )
  const removeProductFromCart = useCartStore( state => state.removeProductFromCart )
  
  const [loaded, setLoaded] = useState(false)
  const productsInCart = useCartStore( state => state.cart )

  useEffect(() => {
    setLoaded(true)
  }, [])
  
  if( !loaded ) {
    return <p>Cargando...</p>
  }

  return (
    <>
      {
        productsInCart.map(product => (
          <div key={`${product.slug}-${product.size}`} className="flex mb-5">
            <Image
              src={`/products/${product.image}`}
              width={100}
              height={100}
              style={{
                width: '100px',
                height: '100px'
              }}
              alt={product.title}
              className="mr-5 rounded"
            />

            <div>
              <Link 
                className="hover:underline cursor-pointer" 
                href={`/product/${ product.slug }`}
              >
                {product.size} - {product.title}
              </Link>
              
              <p>${product.price} </p>
              
              <QuantitySelector 
                quantity={product.quantity} 
                onQuantityChanged={ value => updateProductQuantity(product, value)}
              />
              
              <button 
                className="underline mt-3"
                onClick={() => removeProductFromCart(product)}
              >
                Remover
              </button>
            </div>

          </div>
        ))
      }
    </>
  )
}
