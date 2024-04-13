'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, CreateOrderActions } from '@paypal/paypal-js'
import { ok } from 'assert'


interface Props {
  orderId: string
  amount: number
}

export const PayPalButton = ({ orderId, amount }: Props) => {

  const [{ isPending }] = usePayPalScriptReducer()

  const roundedAmount = Math.round( amount * 100 ) / 100



  if( isPending ) {
    return (
      <div className="animate-pulse mb-12">
        <div className="h-11 bg-gray-300 rounded" />
        <div className="h-11 bg-gray-300 rounded mt-3.5" />
      </div>
    )
  }

  const createOrder = async(data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

    const transactionId = await actions.order.create({
      purchase_units: [
        {
          //invoice_id: 'order_id',
          amount: {
            value: `${ roundedAmount }`,
          }
        }
      ]
    })

    // Todo: Save transactionId in database
    // actions/payments/ setTransactionId(transactionId)
    if( !ok ) {
      throw new Error('No se pudo actualizar la orden, intente de nuevo')
    }

    console.log({ transactionId });
    
    return transactionId
  }



  return (
    <PayPalButtons 
      createOrder={ createOrder }
    />
  )
}
