import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default function( { params }: Props ) {
  
  const { id } = params;
  const products = initialData.products.filter( prod => prod.gender === id )

  const labels = {
    'men': "Hombres",
    'women': "Mujeres",
    'kid': "Niños" 
  }
  
  // if ( id === 'kid' ) {
  //    notFound();
  // }
  
  return (
    <>
    <Title
      title={`Artículos de ${ (labels as any)[id] }`}
      subtitle="Todos los productos"
      className="mb-2"
    />
    <ProductGrid products={ products } />
  </>
  );
}