import { Product } from '@/interfaces'
import Image from 'next/image'

interface Props {
    product: Product
}

export const ProductGridItem2 = ({ product }: Props) => {
  return (
    <div className="rounded-md overflow-hidden fade-in">
        <Image
            src={`/products/${product.images[0] }`}
            alt={ product.title }
            className="w-full h-56 object-cover object-center"
            width={ 500 }
            height={ 500}
        />
        <div className="p-4">
            <h2 className="text-gray-900 font-bold text-2xl">{product.title}</h2>
            <p className="text-gray-600 text-sm mt-2">{product.description}</p>
            <div className="flex justify-between items-center mt-4">
                <h2 className="text-gray-700 font-bold">${product.price}</h2>
                <button className="px-3 py-1 bg-gray-800 text-white text-xs font-bold uppercase rounded">Add to Cart</button>
            </div>
        </div>
    </div>
  )
}
