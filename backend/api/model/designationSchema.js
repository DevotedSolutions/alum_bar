const mongoose = require("mongoose");

const priceFactorSchema = mongoose.Schema({
  euro: {
    type: Number,
    required: true,
    default: 45,
  },
  may: {
    type: Number,
    required: true,
    default: 0,
  },
  reu: {
    type: Number,
    required: true,
    default: 0,
  },
  others: {
    type: Number,
    required: true,
    default: 0,
  },
});

const priceSchema = mongoose.Schema({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  price_local: {
    type: Number,
  },
  price_may: {
    type: Number,
  },
  price_reu: {
    type: Number,
  },
});

const designationSchema = mongoose.Schema({
  designation: {
    type: String,
    required: true,
  },
  vitrage: {
    type: String,
  },
  cermone: {
    type: String,
  },
  category: {
    type: String,
  },
  priceList: [priceSchema],
  priceFactor: priceFactorSchema,
  image: {
    type: String,
  },
});

const designationModel = mongoose.model("designation", designationSchema);

module.exports = designationModel;
