import express from "express";
import Stripe from "stripe";
import ProductsModel from "../products/model.js";

const stripe = new Stripe(
  "sk_test_51Mt7AULbhRb2c4MqmoYIaRnwi6CwOO46q8bDW8oTynGHTbRsuZKllS2cMHGRWO4MRijZ8FtbTvsgkpRdVnspzCjh00ScNT9CNY"
);

const paymentRouter = express.Router();
import CartModel from "../cart/model.js";

paymentRouter.post("/", async (req, res) => {
  try {
    const { amount, token, userID, productIds } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source: token.id
    });
    if (charge) {
      await CartModel.deleteMany({ userID });
      // process the order and get the list of product ids
      // update the addtocart property to false for all products in the order
      await ProductsModel.updateMany(
        { _id: { $in: productIds }, addtocart: true },
        { addtocart: false }
      );

      res.json({ success: true, charge });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default paymentRouter;
