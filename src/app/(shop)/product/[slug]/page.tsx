export const revalidate = 604080 // 7 days

import { notFound } from "next/navigation";

import { getProductBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import { ProductMobileSlideshow, ProductSlideshow, QuantitySelector, SizeSelector, StockLabel } from "@/components";


interface Props {
  params: {
    slug: string;
  }
}

export default async function ProductByPage({ params }: Props) {

  const { slug } = params
  const product = await getProductBySlug(slug)

  if ( !product ) {
    notFound()
  }
  
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      
      <div className="col-span-1 md:col-span-2">
          
          {/* Mobile Slideshow */}
          <ProductMobileSlideshow
            images={ product.images } 
            title={ product.title }
            className="block md:hidden" 
          />
          
          {/* Desktop Slideshow */}
          <ProductSlideshow 
            images={ product.images } 
            title={ product.title } 
            className="hidden md:block"
          />
      
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
        
        <StockLabel slug={ product.slug } />

        <h1 className={` ${ titleFont.className } antialiased font-bold text-xl`}>
          { product.title}
        </h1>

        <p className="text-lg mb-5">
          ${ product.price}
        </p>

        {/* Selector de Talles */}
        <SizeSelector 
          selectedSize={ product.sizes[1]} 
          availableSizes={product.sizes} 
        />

        {/* Selector de Cantidad*/}
        <QuantitySelector quantity={1} />  

        {/* Button */}
        <button className="btn-primary my-5">
            Agregar al carrito
        </button>


        {/* Descripcion */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">
          { product.description }
        </p>


      </div>


    </div>
  );
}