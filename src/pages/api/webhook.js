import { buffer } from "micro";
import * as admin from 'firebase-admin';
// import Stripe from "stripe";


// ! Secure a Connection to firebase
const serviceAccout = require('../../../permissions.json')

const app = !admin.apps.length ? admin.initializeApp({
    credential : admin.credential.cert(serviceAccout)
}) : admin.app();

// ! Establish Connection to Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fullfillOrder = async (session) => {
    console.log('Full filling Order');

    return app.firestore().collection('users').doc(session.metadata.email).collection('orders').doc(session.id).set({
        amount : session.amount_total / 100,
        amount_shipping : session.total_details.amount_shipping / 100,
        images : JSON.parse(session.metadata.images),
        timestamp : admin.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
        console.log(`SUCCESS : Order ${session.id} has been added to the database`)
    })
}

export default async (req, res) => {
    if(req.method === 'POST') {
        const requestBuffer = await buffer(req);
        const payload = requestBuffer.toString();
        const sig = req.headers["stripe-signature"];

        let event;

        // ! Verify that the EVENT Came from Stripe
        try{
            event = stripe.webhooks.constructEvent(payload , sig , endpointSecret)
        } catch (err){
            console.log('ERROR' ,  err.message);
            return res.status(400).send(`Webhook Error ${err.message}`)
        }

        // ! Hanle the Special Stripe Checkout
        if(event.type === 'checkout.session.completed'){
            const session = event.data.object;
            return fullfillOrder(session).then(() => {
                res.status(200) 
            }).catch((err) => res.status(400).send(`WEBHOOK ERROR : ${err.message}`))
            // ! Fullfill the Order

        }
    }
};

export const config = {
    api : {
        bodyParser : false,
        externalResolver : true,
    }
}