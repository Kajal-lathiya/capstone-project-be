import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const Book = new Schema({
  productID: { type: String },
  title: { type: String },
  price: { type: Number },
  orderQuantity: { type: Number }
});

const checkoutSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderProduct: { type: [Book] },
    totalMoney: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default model("Checkout", checkoutSchema);
