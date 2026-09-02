const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productColor: {
    type: String,
  },
  productCategory: {
    type: String,
  },
  productCermone: {
    type: String,
  },
  productVitrage: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  productcode: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  // Per-product stock-level cutoffs driving the quantity badge color
  // (frontend/src/theme/tokens.js productStockBand) — quantity <= criticalMax
  // is red, <= toOrderMax is yellow, otherwise green; healthyMin is the
  // target/ideal restock level shown alongside the badge.
  criticalMax: {
    type: Number,
  },
  toOrderMax: {
    type: Number,
  },
  healthyMin: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
