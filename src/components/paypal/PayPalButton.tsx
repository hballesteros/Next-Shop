'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js'
import { paypalCheckPayment, setTransactionId } from '@/actions'


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

    // Server action
    const { ok } = await setTransactionId(orderId, transactionId);

    if( !ok ) {
      throw new Error('No se pudo actualizar la orden, intente de nuevo')
    }
   
    return transactionId
  }

  const onApprove = async(data: OnApproveData, actions: OnApproveActions): Promise<void> => {

    console.log('onApprove');
    
    const detail = await actions.order?.capture()
    if ( !detail ) return

    await paypalCheckPayment( detail.id )
  
   
  }



  return (
    <PayPalButtons 
      createOrder={ createOrder }
      onApprove={ onApprove }
    />
  )
}
