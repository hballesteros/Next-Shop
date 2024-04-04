'use client'

import { useCartStore } from "@/store"
import { useEffect, useState } from "react"

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
        <span className="text-right">$ { subTotalPrice }</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">$ { tax }</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">$ { totalPrice }</span>

      </div>
    </>
  )
}
