import Image from "next/image";
import Currency from 'react-currency-formatter'
import { useDispatch } from "react-redux";
import { addToBasket, removeFromBasket } from "../slices/basketSlice";
const CheckoutProduct = ({
  id,
  title,
  price,
  description,
  category,
  image,
}) => {
    const dispatch = useDispatch();
    const removeItemFromBasket = () => {
        dispatch(removeFromBasket({id}))
    }
    const addItemToBasket = () => {
        const product = {
            id,
            title,
            price,
            description,
            category,
            image,
        }
        dispatch(addToBasket(product));
    }
  return <div className='grid grid-cols-5 '>
      <Image 
        src={image}
        height={200}
        width={200}
        objectFit='contain'
      />
      {/* Middle Section */}
      <div className='col-span-3 mx-5'>
        <p>{title}</p>
        <p className='text-xs my-2 line-clamp-3'>{description}</p>
        <Currency quantity={price} currency='INR' />
      </div>
      {/* ! Right Add and Remove Buttons */}
       <div className='flex flex-col space-y-2 my-auto justify-self-end'>
        <button className="button mt-auto" onClick={addItemToBasket}>Add to Basket</button>
        <button className="button mt-auto" onClick={removeItemFromBasket}>Remove from Basket</button>
       </div>
  </div>;
};

export default CheckoutProduct;
