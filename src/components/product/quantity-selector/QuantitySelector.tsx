'use client'

import { IoAddCircleOutline, IoRemoveCircleOutline, IoCartOutline, IoCloseOutline } from 'react-icons/io5'


interface Props {
  quantity: number
  onQuantityChanged: (value: number) => void
}


/**
 * QuantitySelector component allows the user to select a quantity value.
 *
 * @param {Object} props - The component props.
 * @param {number} props.quantity - The current quantity value.
 * @param {Function} props.onQuantityChanged - The callback function to be called when the quantity value changes.
 * @returns {JSX.Element} The QuantitySelector component.
 */
export const QuantitySelector = ({ quantity, onQuantityChanged }: Props ) => {

  const onValueChange = (value: number) => {
    if( quantity + value < 1 ) return
    onQuantityChanged( quantity + value )
  }
  
  return (
    <div className="flex">
      <button
        onClick={() => onValueChange(-1)}
      >
        <IoRemoveCircleOutline size={30} />
      </button>
      <span className="w-20 mx-3 px-5 bg-gray-100 text-center">
        { quantity }
      </span>
      <button
        onClick={() => onValueChange(+1)}
      >
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  )
}
