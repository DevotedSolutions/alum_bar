const mongoose = require('mongoose');


const designationSchema = mongoose.Schema({
  designation: {
    type: String,
  },
  vitrage:{
    type:String
  },
  cermone:{
    type:String
  },
  priceList:{
    type: String
  },
  image:{
    type: String,
  },


});

const designationModel = mongoose.model('designation', designationSchema);

module.exports = designationModel;