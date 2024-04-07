'use server'

import prisma from "@/lib/prisma"

import { auth } from "@/auth.config"
import { Address, Size } from "@/interfaces"
import { log } from 'console';

interface ProductToOrder {
  productId: string
  quantity: number
  size: Size
}

export const placeOrder = async( productIds: ProductToOrder[], address: Address ) => {

  const session = await auth()
  const userId = session?.user.id

  // 1. Verificar si hay usuario autenticado
  if ( !userId ) {
    return {
      ok: false,
      message: 'No hay usuario autenticado'
    }
  }

  // 2. Obtener la información de los productos
  // Nota: podemos llevar +2 productos con el mismo ID ( diferente talla )
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map( product => product.productId )
      }
    }
  })

  // 3. Calcular los montos
  // productos en la orden
  const itemsInOrder = productIds.reduce( ( count, p ) => count + p.quantity, 0 )

  const { subTotal, tax, total } = productIds.reduce( (totals,item) => {
      
    const productQuantity = item.quantity
    const product = products.find( product => product.id === item.productId )
    
    if ( !product ) {
      throw new Error(`Producto ${item.productId} no encontrado - error 500`)
    }

    const subTotal = product.price * productQuantity
    totals.subTotal += subTotal
    totals.tax += subTotal * 0.15
    totals.total += subTotal * 1.15

    return totals

  }, { subTotal: 0, tax: 0, total: 0 } )

  
  // 4. Crear la orden
  
  
}