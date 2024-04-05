'use server'

import prisma from "@/lib/prisma"
import bcryptjs from 'bcryptjs';

/**
 * Registers a new user.
 * @param name - The name of the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns An object with the registration status and message.
 */
export const registerUser = async (name: string, email: string, password: string) => {

  try {

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password, 10)
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return {
      ok: true,
      user: user,
      message: 'Usuario creado correctamente'
    }

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo crear el usuario'
    }
  }

}
