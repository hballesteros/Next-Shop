'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma"

export const getOrderById = async (id: string) => {

  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe iniciar sesión para ver esta información',
    }
  }

  try {
   
    const order = await prisma.order.findUnique({
      where: {
        id: id
      },
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,

                ProductImage: {
                  select: {
                    url: true
                  },
                  take: 1
                }
              }
            }
          }
        },
        OrderAddress: {
          include: {
            country: true
          }
        }
      }
    })

    if(!order) throw `${id} no es una orden válida`

    if(session.user.role !== 'admin' && session.user.id !== order.userId) {
      throw 'No tienes permisos para ver esta orden'
    }  

    return {
      ok: true,
      order: order,
    }

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error al obtener la orden'
    }
  }

}