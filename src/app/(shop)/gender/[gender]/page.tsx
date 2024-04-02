export const revalidate = 60 // 60 segundos

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";


interface Props {
  params: {
    gender?: Gender;
  };
  searchParams: {
    page?: string;
  };
}

export default async function GenderByPage( { params, searchParams }: Props ) {
  
  const gender = params.gender 
  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, gender })
 
  if ( products.length === 0 ) {
    redirect('/gender/men')
  }

  const labels = {
    'men': "de Hombres",
    'women': "de Mujeres",
    'kid': "de Niños",
    'unisex': 'Unisex'
  }

  return (
    <>
      <Title
        title={`Artículos ${ labels[gender as Gender] }`}
        subtitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid products={ products } />

      <Pagination totalPages={ totalPages } />
    </>
  );
}