import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  productID: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
  // any other relevant fields
});

export default model("Cart", cartItemSchema);
