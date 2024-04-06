'use server'

import prisma from '@/lib/prisma'


/**
 * Retrieves a list of countries from the database.
 * 
 * @returns {Promise<Country[]>} A promise that resolves to an array of countries.
 * @throws {Error} If there is an error retrieving the countries.
 */
export const getCountries = async () => {

  try {

    const countries = await prisma.country.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return countries

  } catch (error) {
    console.log(error)
    throw new Error('Error al obtener los paises')
  }

}