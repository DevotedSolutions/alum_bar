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
  }, 
  price: {
    type: Number,
    required: true,
  }, 
   createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;