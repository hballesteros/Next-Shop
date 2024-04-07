'use server'

import prisma from "@/lib/prisma"

import { auth } from "@/auth.config"
import { Address, Size } from "@/interfaces"

interface ProductToOrder {
  productId: string
  quantity: number
  size: Size
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

  const session = await auth()
  const userId = session?.user.id

  // 1. Verificar si hay usuario autenticado
  if (!userId) {
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
        in: productIds.map(product => product.productId)
      }
    }
  })

  // 3. Calcular los montos
  // productos en la orden
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

  const { subTotal, tax, total } = productIds.reduce((totals, item) => {

    const productQuantity = item.quantity
    const product = products.find(product => product.id === item.productId)

    if (!product) {
      throw new Error(`Producto ${item.productId} no encontrado - error 500`)
    }

    const subTotal = product.price * productQuantity
    totals.subTotal += subTotal
    totals.tax += subTotal * 0.15
    totals.total += subTotal * 1.15

    return totals

  }, { subTotal: 0, tax: 0, total: 0 })


  // 4. Crear la transacción de base de datos
  try {

    const prismaTx = await prisma.$transaction(async (tx) => {

      // a. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {

        // Acumular los valores
        const productQuantity = productIds.filter(
          p => p.productId === product.id
        ).reduce((count, item) => count + item.quantity, 0)

        if (productQuantity === 0) {
          throw new Error(`Producto ${product.id} no tiene cantidad definida`)
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity
            }
          }
        })

      })

      const updatedProducts = await Promise.all(updatedProductsPromises)

      // Verificar valores negativos en las existencias
      updatedProducts.forEach(product => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene stock suficiente`)
        }
      })


      // b. Crear la orden - Encabezado - Detalles
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,
          isPaid: false,

          OrderItem: {
            createMany: {
              data: productIds.map(product => ({
                productId: product.productId,
                quantity: product.quantity,
                size: product.size,
                price: products.find(p => p.id === product.productId)?.price ?? 0
              }))
            }
          }
        }
      })

      // Todo: Validar, si el price es cero, lanzar un error


      // c. Crear la dirección de la orden
      const { country, ...restAddress } = address
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: address.country,
          orderId: order.id,
        }
      })

      return {
        ok: true,
        message: 'Orden creada',
        updatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress
      }

    })

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx
    }

  } catch (error: any) {
    return {
      ok: false,
      message: error?.message
    }
  }

}