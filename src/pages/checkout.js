import Header from "../components/Header";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from "react-currency-formatter";
import { session, useSession } from "next-auth/client";
// import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.stripe_public_key)
import axios from 'axios'
const Checkout = () => {
  // console.log(process.env.stripe_public_key)
  const items = useSelector(selectItems);
  const [session] = useSession();
  const total = useSelector(selectTotal);
  const createCheckoutSession = async () => {
      const stripe = await stripePromise;


      // Call the backend to create checkout session
      const checkoutSession = await axios.post('/api/create-checkout-session' , {
        items : items,
        email : session?.user?.email || 'codinghub41@gmail.com'
      });

      // Redirect User to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId : checkoutSession.data.id
      })

      if(result.error){
        alert(result.error.message)
      }
  }
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Checkout</title>
      </Head>
      <Header />
      {/* Left Side */}
      <div className="flex-grow m-5 shadow-sm">
        <Image
          src="https://links.papareact.com/ikj"
          width={1020}
          height={250}
          objectFit="contain"
        />
        <div className="flex flex-col p-5 space-y-10 bg-white">
          <h1 className="text-3xl border-b pb-4">
            {items.length !== 0
              ? "Shopping Basket"
              : "Your Shopping Basket is Empty"}
          </h1>
          {items.map((item, i) => (
            <CheckoutProduct
              key={item.id}
              id={item.id}
              title={item.title}
              price={item.price}
              description={item.description}
              category={item.category}
              image={item.image}
            />
          ))}
        </div>
      </div>

      {/* Right Side */}

      <div className="flex flex-col bg-white p-10 shadow-md">
        {items.length > 0 && (
        <>
            <h2 className="font-bold whitespace-nowrap">
              Subtotal ({items.length} items) : {' '}
              <span><Currency quantity={total} currency='INR' /> </span>
            </h2>

            <button role='link'
              onClick={createCheckoutSession}
              // disabled={!session}
              className={`button mt-2 ${
                !session &&
                "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
              }`}
            >
              {!session ? "Sign in to checkout" : "Proceed to Checkout"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
