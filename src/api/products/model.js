import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 5 },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return ["Electronics", "books", "clothing", "Beauty"].includes(v);
        },
        message:
          "category must be one of 'Electronics', 'books','clothing or 'Beauty'",
      },
    },
    reviews: { type: [reviewSchema] },
  },
  {
    timestamps: true,
  }
);
export default model("Products", productSchema);
