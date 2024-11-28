const mongoose = require("mongoose");

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
  image: {
    type: String,
  },
});

const designationModel = mongoose.model("designation", designationSchema);

module.exports = designationModel;
