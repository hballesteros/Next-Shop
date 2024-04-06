'use client'

import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import Link from "next/link"
import { useEffect, useState } from "react"

export const PlaceOrder = () => {

  const [loaded, setLoaded] = useState(false)

  const address = useAddressStore((state) => state.address)
  const getSummaryInformation = useCartStore(state => state.getSummaryInformation())
  const { totalItems, subTotalPrice, tax, totalPrice } = getSummaryInformation

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) {
    return <p>Cargando...</p>
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">

      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} , {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">

        <span>No. Productos</span>

        <span className="text-right">{totalItems === 1 ? '1 artículo' : `${totalItems} artículos`} </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotalPrice)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{currencyFormat(totalPrice)}</span>

      </div>

      <div className="mt-5 mb-2 w-full">

        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer clic en &quot;Colocar orden&quot;, acepto los <a href="#" className="underline">términos y condiciones</a> de compra y la <a href="#" className="underline">política de privacidad</a> de la empresa.
          </span>
        </p>


        <button
          //href="/orders/123"
          className="flex w-full btn-primary justify-center"
        >
          Colocar orden
        </button>
      </div>

    </div>
  )
}
