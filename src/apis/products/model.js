import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    addtocart: { type: Boolean, default: false },
    price: { type: Number, required: true },
    mainPicture: {
      type: String,
      required: false,
      default: "https://via.placeholder.com/400x400"
    },
    additionalPictures: { type: Array, required: false },
    category: {
      type: String,
      enum: [
        "Home and garden",
        "Electronics",
        "Clothing",
        "Health and beauty",
        "Toys",
        "Other"
      ],
      required: true
    },
    condition: {
      type: String,
      enum: ["Used", "Slightly Used", "New"],
    }
  },
  { timestamps: true }
);

export default model("Product", productsSchema);
