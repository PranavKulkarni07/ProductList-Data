const mongoose = require("mongoose");

//ProductList Model
const productListSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

productListSchema.index({ id: 1 });

const ProductList = mongoose.model("ProductList", productListSchema);

module.exports = ProductList;
