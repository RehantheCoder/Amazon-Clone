import Image from "next/image";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket } from "../slices/basketSlice";
const Product = ({ id, title, price, description, category, image }) => {
  const dispatch = useDispatch();

  const addItemTobasket = () => {
    const product = {
      id,
      title,
      price,
      description,
      category,
      image,
    };
    // ! Sending the product to the redux
    dispatch(addToBasket(product))
  };
  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">
        {category}
      </p>
      <Image src={image} height={200} width={200} objectFit="contain" />

      <h4 className="my-3 ">{title}</h4>

      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-5">
        <Currency quantity={price} currency="INR" />
      </div>
      <button className="mt-auto button" onClick={addItemTobasket}>
        Add To Basket
      </button>
    </div>
  );
};

export default Product;
