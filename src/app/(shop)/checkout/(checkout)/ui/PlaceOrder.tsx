'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"

import { placeOrder } from "@/actions"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat, sleep } from "@/utils"

export const PlaceOrder = () => {

  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const address = useAddressStore((state) => state.address)
  const getSummaryInformation = useCartStore(state => state.getSummaryInformation())
  const { totalItems, subTotalPrice, tax, totalPrice } = getSummaryInformation

  const cart = useCartStore(state => state.cart)
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true)
    // await sleep(2);

    const productsToOrder = cart.map((product) => {
      return {
        productId: product.id,
        quantity: product.quantity,
        size: product.size,
      }
    })

    //! Server Action
    const resp = await placeOrder(productsToOrder, address)
    if ( !resp.ok ) {
      setIsPlacingOrder(false)
      setErrorMessage(resp.message)
      return
    }

    //* Todo salio bién
    clearCart()
    router.replace(`/orders/${resp.order!.id}`)
    
  }


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

        <p className="text-red-500 mb-2">{ errorMessage }</p>

        <button
          //href="/orders/123"
          onClick={onPlaceOrder}
          className={
            clsx({
              "flex w-full justify-center": true,
              "btn-primary": !isPlacingOrder,
              "btn-disabled": isPlacingOrder 
            })
          }
          disabled={isPlacingOrder}
        >
          { isPlacingOrder ? "Colocando orden" : "Colocar orden"}
        </button>
      </div>

    </div>
  )
}
