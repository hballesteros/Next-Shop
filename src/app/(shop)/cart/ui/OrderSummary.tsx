'use client'

import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import { useEffect, useState } from "react"

/**
 * Renders the order summary component.
 * 
 * @returns The JSX element representing the order summary.
 */
export const OrderSummary = () => {
  
  const getSummaryInformation = useCartStore( state => state.getSummaryInformation() )
  const { totalItems, subTotalPrice, tax, totalPrice } = getSummaryInformation
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])
  

  if( !loaded ) {
    return <p>Cargando...</p>
  }
  
  return (
    <>
      <div className="grid grid-cols-2">

        <span>No. Productos</span>
        <span className="text-right">{ totalItems === 1 ? '1 artículo' : `${totalItems} artículos` } </span>

        <span>Subtotal</span>
        <span className="text-right">{ currencyFormat( subTotalPrice ) }</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{ currencyFormat( tax ) }</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{ currencyFormat( totalPrice ) }</span>

      </div>
    </>
  )
}
