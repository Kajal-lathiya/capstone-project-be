import express from "express";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51Mt7AULbhRb2c4MqmoYIaRnwi6CwOO46q8bDW8oTynGHTbRsuZKllS2cMHGRWO4MRijZ8FtbTvsgkpRdVnspzCjh00ScNT9CNY"
);

const paymentRouter = express.Router();
import CartModel from "../cart/model.js";

paymentRouter.post("/", async (req, res) => {
  try {
    const { amount, token, userID } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source: token.id
    });
    if (charge) {
      await CartModel.deleteMany({ userID });
      res.json({ success: true, charge });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default paymentRouter;
