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
  createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
