const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const designationSchema = mongoose.Schema({
  designation: {
    type: String,
    required: true
  },
  vitrage: {
    type: String
  },
  cermone: {
    type: String
  },
  priceList: [priceSchema], 
  image: {
    type: String
  }
});

const designationModel = mongoose.model('designation', designationSchema);

module.exports = designationModel;
