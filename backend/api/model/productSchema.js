const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productDescription: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
  ,productcode:{
    type: String,
    required: true
  }
  ,image:{
    type: String,
    required: true
  }
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;