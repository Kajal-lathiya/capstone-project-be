import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const ProductsSchema = new Schema(
  {
    title: { type: String },
    brand: { type: String },
    price: { type: Number },
    thumbnail: { type: String },
    category: { type: String },
    description: { type: String },
    publish_date: { type: String },
    addtocart: { type: Boolean, default: false }
  },
  { timestamps: true }
);
export default model("Product", ProductsSchema);
