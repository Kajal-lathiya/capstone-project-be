import express from "express";
import CartModel from "./cartModel.js";
import productsModel from "./productsModel.js";
import createHttpError from "http-errors";

const cartRouter = express.Router();

cartRouter.get("/:userId", async (req, res, next) => {
  try {
    const cartItem = await CartModel.find({
      userID: req.params.userId
    }).populate("productID");
    console.log("cartItem:", cartItem);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json(cartItem);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

cartRouter.post("/addToCart", async (req, res, next) => {
  try {
    const { userID, productID, quantity } = req.body;
    // create new cart item with the required fields
    const newCartItem = new CartModel({
      userID,
      productID,
      quantity
    });
    // save the new cart item to the database
    const product_data = {
      addtocart: true
    };
    await newCartItem.save();
    await productsModel.findByIdAndUpdate(productID, product_data, {
      new: true,
      runValidators: true
    });
    res.json({ message: "Cart item added successfully!" });
  } catch (error) {
    next(error);
  }
});

// cartRouter.put("/:id", async (req, res, next) => {
//   try {
//     const updatedProduct = await CartModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (updatedProduct) res.status(200).send(updatedProduct);
//     else
//       next(createHttpError(404, `Product with id ${req.params.id} not found!`));
//   } catch (error) {
//     next(error);
//   }
// });

cartRouter.put("/updateCartItem", async (req, res) => {
  try {
    const { userID, productID, quantity } = req.body;

    // find the existing cart item by userID and productID
    const existingCartItem = await CartModel.findOne({ userID, productID });
    if (!existingCartItem) {
      // handle case where cart item doesn't exist
      return res.status(404).json({ message: "Cart item not found!" });
    }

    // update the quantity field of the cart item
    existingCartItem.quantity = quantity;
    // save the updated cart item to the database
    await existingCartItem.save();
    res.json({ message: "Cart item updated successfully!" });
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/:cartID", async (req, res, next) => {
  try {
    const deleteProduct = await CartModel.findByIdAndDelete(req.params.cartID);
    if (deleteProduct) res.status(204).send();
    else
      next(
        createHttpError(404, `Product with id ${req.params.cartID} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

export default cartRouter;
