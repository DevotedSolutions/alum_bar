const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productSoldBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'deveotes-task1',
    required: true,

  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  saleDate: {
    type: Date,
    default: Date.now,
  },
});


const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;