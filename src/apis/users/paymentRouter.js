import express from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.PAYMENT_SECRET);

const paymentRouter = express.Router();

paymentRouter.post("/", async (req, res, next) => {
  try {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
              images: [product.image]
            },
            unit_amount: product.amount * 100
          },
          quantity: product.quantity
        }
      ],
      mode: "payment",
      success_url: `${process.env.FE_URL}/success.html`,
      cancel_url: `${process.env.FE_URL}/cancel.html`
    });
    if (session) {
      res.json({ id: session.id });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

// paymentRouter.post("/create-payment", async (req, res) => {
//   const { amount, currency, payment_method } = req.body;

//   // Create a new payment intent
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency,
//     payment_method,
//     customer: req.user.stripeCustomerId // assuming you have a logged in user with a Stripe customer ID stored in your MongoDB
//   });

//   // Update the payment status in your MongoDB
//   await Payment.findOneAndUpdate(
//     { paymentIntentId: paymentIntent.id },
//     { status: "created" }
//   );

//   // Return the payment intent ID to the client-side
//   res.send({ paymentIntentId: paymentIntent.id });
// });

// paymentRouter.post("/handle-payment", async (req, res) => {
//   const { paymentIntentId } = req.body;

//   // Retrieve the payment intent object from Stripe
//   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//   // Update the payment status in your MongoDB
//   await Payment.findOneAndUpdate(
//     { paymentIntentId: paymentIntent.id },
//     { status: paymentIntent.status }
//   );

//   // Return the payment status to the client-side
//   res.send({ status: paymentIntent.status });
// });

export default paymentRouter;
