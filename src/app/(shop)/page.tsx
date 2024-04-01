import { getPaginatedProductsWithImages } from '@/actions'
import { Title, ProductGrid } from '@/components'
import { initialData } from '@/seed/seed'


const products = initialData.products


export default async function Home() {

  const productsTemp = await getPaginatedProductsWithImages()

  return (
    <>
      <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid products={ products } />
    </>
  )
}
