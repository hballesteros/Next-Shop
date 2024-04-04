'use client'

import { useCartStore } from "@/store"

export const OrderSummary = () => {
  
  const getSummaryInformation = useCartStore( state => state.getSummaryInformation() )
  const { totalItems, subTotalPrice, tax, totalPrice } = getSummaryInformation
  
  return (
    <>
      <div className="grid grid-cols-2">

        <span>No. Productos</span>
        <span className="text-right">{ totalItems } artículos</span>

        <span>Subtotal</span>
        <span className="text-right">$ { subTotalPrice }</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">$ { tax }</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">$ { totalPrice }</span>

      </div>
    </>
  )
}
