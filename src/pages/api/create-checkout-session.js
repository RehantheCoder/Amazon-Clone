const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req , res) => {
   const {items , email} = req.body;
   
   console.log(items , email);

   const transformedItems = items.map(item => ({
      price_data : {
         currency : 'inr',
         product_data : {
            name : item.title,
            images:[item.image],
         },
         unit_amount :  item.price * 100,
      },
      description : item.description,
      quantity : 1,
   }));

   const session  = await stripe.checkout.sessions.create({
      payment_method_types : ['card'],
      shipping_address_collection : {
         allowed_countries : ['IN' , 'US' , 'GB' , 'CA']
      }, 
      shipping_rates : ['shr_1JXUydSAPO02BrNJ3Kyew7At'],
      line_items : transformedItems,
      mode : 'payment',
      success_url : `${process.env.HOST}/success`,
      cancel_url : `${process.env.HOST}/checkout`,
      metadata: {
         email,
         images : JSON.stringify(items.map(item => item.image))
      }

   });

   res.status(200).json({id : session.id})
}